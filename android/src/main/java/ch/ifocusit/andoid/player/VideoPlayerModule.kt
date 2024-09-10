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
        @Field val videoSize: Dimensions,
        @Field val seekable: Boolean,
        @Field val duration: Long
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
            Events("onLoaded", "onProgress", "onPlaying", "onEnded", "onError")

            Prop("player") { view: VideoView, player: VlcPlayer ->
                println("set player")
                view.player = player
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

            Property("currentTime")
                .get { ref: VlcPlayer -> ref.player.time }
                .set { ref: VlcPlayer, timeInMillis: Long ->
                    appContext.mainQueue.launch { ref.player.time = timeInMillis }
                }

            Property("position")
                .get { ref: VlcPlayer -> ref.player.position }
                .set { ref: VlcPlayer, positionPercentage: Float ->
                    appContext.mainQueue.launch { ref.player.position = positionPercentage }
                }

            Property("audioTracks")
                .get { ref: VlcPlayer ->
                    ref.player.getTracks(IMedia.Track.Type.Audio).map { Track(it.id, it.name) }
                }

            Property("selectedAudioTrack")
                .get { ref: VlcPlayer ->
                    ref.player.getSelectedTrack(IMedia.Track.Type.Audio)
                        .let { Track(it.id, it.name) }
                }
                .set { ref: VlcPlayer, trackId: String ->
                    appContext.mainQueue.launch {
                        ref.player.selectTracks(IMedia.Track.Type.Audio, trackId)
                    }
                }

            Property("selectedTextTrack")
                .get { ref: VlcPlayer ->
                    ref.player.getSelectedTrack(IMedia.Track.Type.Text)
                        .let { Track(it.id, it.name) }
                }
                .set { ref: VlcPlayer, trackId: String ->
                    appContext.mainQueue.launch {
                        ref.player.selectTracks(IMedia.Track.Type.Text, trackId)
                    }
                }

            Property("textTracks")
                .get { ref: VlcPlayer ->
                    ref.player.getTracks(IMedia.Track.Type.Text).map { Track(it.id, it.name) }
                }

            Property("isSeekable").get { ref: VlcPlayer -> ref.player.isSeekable }

            Property("isPlaying").get { ref: VlcPlayer -> ref.player.isPlaying }

            Property("paused")
                .get { ref: VlcPlayer ->
                    !ref.player.isPlaying
                }
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

            Property("audioDelay")
                .get { ref: VlcPlayer ->
                    ref.player.audioDelay
                }
                .set { ref: VlcPlayer, delayInMillis: Long ->
                    appContext.mainQueue.launch {
                        ref.player.audioDelay = delayInMillis
                    }
                }
        }
    }
}
