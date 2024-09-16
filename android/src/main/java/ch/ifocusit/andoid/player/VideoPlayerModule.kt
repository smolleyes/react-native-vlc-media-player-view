package ch.ifocusit.andoid.player

import android.app.Activity
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.launch
import org.videolan.libvlc.interfaces.IMedia

class VideoPlayerModule : Module() {
    data class PlayerConfiguration(
        @Field val initOptions: List<String>
    ) : Record

    data class VideoSource(
        @Field val uri: String,
    ) : Record

    data class Dimensions(
        @Field val width: Int,
        @Field val height: Int
    ) : Record

    data class VideoInfo(
        @Field val track: Track,
        @Field val videoSize: Dimensions,
        @Field val seekable: Boolean,
        @Field val duration: Long,
        @Field val audioTracks: List<Track>,
        @Field val textTracks: List<Track>
    ) : Record

    data class ProgressInfo(
        @Field val time: Long,
        @Field val position: Float
    ) : Record

    data class Track(
        @Field val id: String,
        @Field val name: String
    ) : Record

    data class Position(
        @Field val position: Float,
        @Field val fastSeeking: Boolean
    ) : Record

    private val activity: Activity
        get() = appContext.activityProvider?.currentActivity ?: throw Exceptions.MissingActivity()

    override fun definition() = ModuleDefinition {
        Name("VideoPlayerModule")

        View(VideoView::class) {
            Events("onLoaded", "onProgress", "onPaused", "onEnded", "onError")

            Prop("player") { view: VideoView, player: VlcPlayer ->
                view.videoPlayer = player
            }

            OnViewDestroys { view: VideoView ->
                VideoManager.unregisterVideoView(view)
            }
        }

        Class(VlcPlayer::class) {
            Constructor { config: PlayerConfiguration? ->
                val player = VlcPlayer(activity.applicationContext, appContext, config)
                return@Constructor player
            }

            Property("source")
                .get { ref: VlcPlayer -> ref.source }
                .set { ref: VlcPlayer, source: VideoSource ->
                    appContext.mainQueue.launch {
                        ref.source = source
                    }
                }

            Property("isSeekable").get { ref: VlcPlayer -> ref.player.isSeekable }
            Property("time")
                .get { ref: VlcPlayer -> ref.player.time }
                .set { ref: VlcPlayer, timeInMillis: Long ->
                    appContext.mainQueue.launch { ref.setTime(timeInMillis) }
                }
            Property("position")
                .get { ref: VlcPlayer -> ref.player.position }
                .set { ref: VlcPlayer, positionPercentage: Float ->
                    appContext.mainQueue.launch { ref.player.position = positionPercentage }
                }

            Property("audioTracks")
                .get { ref: VlcPlayer ->
                    (ref.player.getTracks(IMedia.Track.Type.Audio) ?: arrayOf()).map {
                        Track(
                            it.id,
                            it.name
                        )
                    }
                }
            Property("selectedAudioTrackId")
                .get { ref: VlcPlayer ->
                    ref.player.getSelectedTrack(IMedia.Track.Type.Audio)?.id
                }
                .set { ref: VlcPlayer, id: String ->
                    appContext.mainQueue.launch {
                        ref.player.selectTracks(IMedia.Track.Type.Audio, id)
                    }
                }

            Property("selectedTextTrackId")
                .get { ref: VlcPlayer ->
                    ref.player.getSelectedTrack(IMedia.Track.Type.Text)?.id
                }
                .set { ref: VlcPlayer, id: String ->
                    appContext.mainQueue.launch {
                        ref.player.selectTracks(IMedia.Track.Type.Text, id)
                    }
                }
            Property("textTracks")
                .get { ref: VlcPlayer ->
                    (ref.player.getTracks(IMedia.Track.Type.Text) ?: arrayOf()).map {
                        Track(it.id, it.name)
                    }
                }

            Property("isPlaying").get { ref: VlcPlayer -> ref.player.isPlaying && ref.player.time != ref.player.length }
            Property("paused")
                .get { ref: VlcPlayer -> !ref.player.isPlaying }
                .set { ref: VlcPlayer, paused: Boolean ->
                    appContext.mainQueue.launch {
                        if (paused) ref.player.pause() else ref.player.play()
                    }
                }
            Function("play") { ref: VlcPlayer, source: VideoSource? ->
                appContext.mainQueue.launch { ref.play(source) }
            }
            Function("pause") { ref: VlcPlayer ->
                appContext.mainQueue.launch { ref.player.pause() }
            }
            Function("togglePlay") { ref: VlcPlayer ->
                appContext.mainQueue.launch {
                    if (ref.player.isPlaying) ref.player.pause() else ref.player.play()
                }
            }
            Function("stop") { ref: VlcPlayer ->
                appContext.mainQueue.launch { ref.player.stop() }
            }

            Property("audioDelay")
                .get { ref: VlcPlayer -> ref.player.audioDelay }
                .set { ref: VlcPlayer, delayInMillis: Long ->
                    appContext.mainQueue.launch {
                        ref.player.audioDelay = delayInMillis
                    }
                }

            Property("videoInfo")
                .get { ref: VlcPlayer -> ref.videoInfo() }

            Property("progressInfo")
                .get { ref: VlcPlayer -> ref.progressInfo() }

            Property("title")
                .get { ref: VlcPlayer -> ref.title }
                .set { ref: VlcPlayer, title: String ->
                    appContext.mainQueue.launch {
                        ref.title = title
                    }
                }
        }

        OnActivityEntersForeground {
            VideoManager.onAppForegrounded()
        }

        OnActivityEntersBackground {
            VideoManager.onAppBackgrounded()
        }
    }
}
