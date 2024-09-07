package ch.ifocusit.vlc

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable
import org.videolan.libvlc.MediaPlayer
import org.videolan.libvlc.interfaces.IMedia

class VlcPlayerModule : Module() {
    class PlayerSource : Record {
        @Field
        val uri: String = ""

        @Field
        val autoplay: Boolean = true
    }

    class Dimensions : Record {
        @Field
        var width = 0

        @Field
        var height = 0
    }

    class VideoInfo : Record {
        @Field
        var videoSize = Dimensions()

        @Field
        var seekable = true
    }

    class ProgressInfo : Record {
        @Field
        var currentTime = 0L

        @Field
        var position = 0F
    }

    class Track : Record {
        @Field
        var id = ""

        @Field
        var name = ""
    }

    enum class ScaleType(val value: String) : Enumerable {
        BEST_FIT("best_fit"),
        FIT_SCREEN("fit_screen"),
        FILL_SCREEN("fill_screen"),
        RATIO_16_9("ratio_16_9"),
        RATIO_16_10("ratio_16_10"),
        RATIO_4_3("ratio_4_3"),
        ORIGINAL("original"),
    }

    override fun definition() = ModuleDefinition {
        Name("RNVlcPlayer")

        View(VlcPlayer::class) {
            Events("onLoaded", "onProgress", "onPlaying", "onEnd", "onError")

            Prop("source") { view: VlcPlayer, options: PlayerSource ->
                view.setSource(options)
            }
            AsyncFunction("setSource") { view: VlcPlayer, options: PlayerSource ->
                view.setSource(options)
            }

            Prop("scale") { view: VlcPlayer, scale: ScaleType ->
                when (scale) {
                    ScaleType.BEST_FIT -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_BEST_FIT

                    ScaleType.FIT_SCREEN -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_FIT_SCREEN

                    ScaleType.FILL_SCREEN -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_FILL

                    ScaleType.RATIO_16_9 -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_16_9

                    ScaleType.RATIO_16_10 -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_16_10

                    ScaleType.RATIO_4_3 -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_4_3

                    ScaleType.ORIGINAL -> view.player.videoScale =
                        MediaPlayer.ScaleType.SURFACE_ORIGINAL
                }
            }

            Prop("paused") { view: VlcPlayer, paused: Boolean ->
                if (paused) view.player.pause() else view.player.play()
            }
            AsyncFunction("setPaused") { view: VlcPlayer, paused: Boolean ->
                if (paused) view.player.pause() else view.player.play()
            }
            AsyncFunction("play") { view: VlcPlayer ->
                view.player.play()
            }
            AsyncFunction("pause") { view: VlcPlayer ->
                view.player.pause()
            }
            AsyncFunction("togglePlay") { view: VlcPlayer ->
                if (view.player.isPlaying) view.player.pause() else view.player.play()
            }
            AsyncFunction("isPlaying") { view: VlcPlayer ->
                return@AsyncFunction view.player.isPlaying
            }

            AsyncFunction("setVolume") { view: VlcPlayer, value: Int ->
                view.player.volume = value
            }
            AsyncFunction("getVolume") { view: VlcPlayer ->
                return@AsyncFunction view.player.volume
            }

            AsyncFunction("setAudioDelay") { view: VlcPlayer, value: Long ->
                view.player.audioDelay = value
            }
            AsyncFunction("getAudioDelay") { view: VlcPlayer ->
                return@AsyncFunction view.player.audioDelay
            }

            AsyncFunction("isSeekable") { view: VlcPlayer ->
                return@AsyncFunction view.player.isSeekable
            }
            AsyncFunction("seekTo") { view: VlcPlayer, value: Long ->
                view.player.time = value
            }
            AsyncFunction("getTime") { view: VlcPlayer ->
                return@AsyncFunction view.player.time
            }

            Prop("audioTrack") { view: VlcPlayer, trackId: String ->
                view.player.selectTrack(trackId)
            }
            Prop("textTrack") { view: VlcPlayer, trackId: String ->
                view.player.selectTrack(trackId)
            }
            AsyncFunction("getSelectedAudioTrack") { view: VlcPlayer ->
                return@AsyncFunction view.player.getSelectedTrack(IMedia.Track.Type.Audio)
                    ?.let { track: IMedia.Track ->
                        {
                            Track().also {
                                it.id = track.id
                                it.name = track.name
                            }
                        }
                    }
            }
            AsyncFunction("getSelectedTextTracks") { view: VlcPlayer ->
                return@AsyncFunction view.player.getSelectedTrack(IMedia.Track.Type.Text)
                    ?.let { track: IMedia.Track ->
                        {
                            Track().also {
                                it.id = track.id
                                it.name = track.name
                            }
                        }
                    }
            }
            AsyncFunction("getAudioTracks") { view: VlcPlayer ->
                return@AsyncFunction view.player.getTracks(IMedia.Track.Type.Audio)
                    .map { track: IMedia.Track ->
                        {
                            Track().also {
                                it.id = track.id
                                it.name = track.name
                            }
                        }
                    }
            }
            AsyncFunction("getTextTracks") { view: VlcPlayer ->
                return@AsyncFunction view.player.getTracks(IMedia.Track.Type.Text)
                    .map { track: IMedia.Track ->
                        {
                            Track().also {
                                it.id = track.id
                                it.name = track.name
                            }
                        }
                    }
            }
        }
    }
}
