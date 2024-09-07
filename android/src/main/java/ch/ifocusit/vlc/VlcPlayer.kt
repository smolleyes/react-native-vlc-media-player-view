package ch.ifocusit.vlc

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.net.Uri
import ch.ifocusit.vlc.VlcPlayerModule.Dimensions
import ch.ifocusit.vlc.VlcPlayerModule.ProgressInfo
import ch.ifocusit.vlc.VlcPlayerModule.VideoInfo
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer
import org.videolan.libvlc.interfaces.IMedia
import org.videolan.libvlc.interfaces.IMedia.VideoTrack
import org.videolan.libvlc.util.VLCVideoLayout

@Suppress("SameParameterValue")
@SuppressLint("ViewConstructor")
class VlcPlayer(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    private val TAG = "VlcPlayer"

    private var libVLC: LibVLC
    internal var player: MediaPlayer
    private val videoLayout = VLCVideoLayout(context)

    private var videoInfo: VideoInfo? = null

    private val onLoaded by EventDispatcher<VideoInfo>()
    private val onProgress by EventDispatcher<ProgressInfo>()
    private val onPlaying by EventDispatcher<Boolean>()
    private val onEnd by EventDispatcher<Boolean>()
    private val onError by EventDispatcher<Boolean>()

    init {
        addView(videoLayout)
        videoLayout.setBackgroundColor(Color.BLACK)

        libVLC = LibVLC(context)
        player = MediaPlayer(libVLC)
        player.attachViews(videoLayout, null, true, true)
        player.videoScale = MediaPlayer.ScaleType.SURFACE_FIT_SCREEN
        player.volume = 10

        player.setEventListener { event ->
            run {
                when (event.type) {
                    MediaPlayer.Event.Buffering -> {
                        videoInfo = videoInfo()
                        val audioTracks = player.getTracks(IMedia.Track.Type.Audio)
                        if (videoInfo != null && audioTracks?.isNotEmpty() == true) {
                            onLoaded(videoInfo!!)
                        }
                    }

                    MediaPlayer.Event.EndReached -> {
                        onEnd(true)
                    }

                    MediaPlayer.Event.Playing -> {
                        val playing = player.isPlaying
                        onPlaying(playing)
                        keepScreenOn = playing
                    }

                    MediaPlayer.Event.TimeChanged -> {
                        onProgress(ProgressInfo().also {
                            it.currentTime = event.timeChanged
                            it.position = player.position
                        })
                    }

                    MediaPlayer.Event.EncounteredError -> {
                        onError(true)
                    }
                }
            }
        }
    }

    private fun videoInfo(): VideoInfo? {
        val videoTrack = player.getSelectedTrack(IMedia.Track.Type.Video) as VideoTrack?
        return if (videoTrack == null) null else VideoInfo().also {
            it.videoSize = Dimensions().also { dimensions ->
                dimensions.width = videoTrack.width
                dimensions.height = videoTrack.height
            }
            it.seekable = player.isSeekable
        }
    }

    private fun media(uri: String): Media {
        if (uri.startsWith("http")) {
            return Media(libVLC, Uri.parse(uri))
        }
        return Media(libVLC, uri)
    }

    fun setSource(source: VlcPlayerModule.PlayerSource) {
        val media = media(source.uri)
        player.media = media
        media.release()
        if (source.autoplay) {
            player.play()
        }
    }
}
