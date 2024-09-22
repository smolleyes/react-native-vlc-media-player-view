package ch.ifocusit.andoid.player

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import ch.ifocusit.andoid.player.VideoPlayerModule.Dimensions
import ch.ifocusit.andoid.player.VideoPlayerModule.PlayerConfiguration
import ch.ifocusit.andoid.player.VideoPlayerModule.ProgressInfo
import ch.ifocusit.andoid.player.VideoPlayerModule.Track
import ch.ifocusit.andoid.player.VideoPlayerModule.VideoInfo
import ch.ifocusit.andoid.player.VideoPlayerModule.VideoSource
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.sharedobjects.SharedObject
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer
import org.videolan.libvlc.interfaces.IMedia
import org.videolan.libvlc.interfaces.IMedia.VideoTrack
import org.videolan.libvlc.util.VLCVideoLayout

@Suppress("SameParameterValue")
@SuppressLint("ViewConstructor")
class VlcPlayer(context: Context, appContext: AppContext, config: PlayerConfiguration?) :
    SharedObject(appContext) {

    var view: VideoView? = null
    internal var videoInfo: VideoInfo? = null

    val staysActiveInBackground = false

    private val libVLC: LibVLC =
        if (config?.initOptions != null) LibVLC(context, config.initOptions)
        else LibVLC(context)

    internal val videoLayout = VLCVideoLayout(context)

    internal val player: MediaPlayer = MediaPlayer(libVLC).also {
        it.attachViews(videoLayout, null, false, false)
        it.videoScale = MediaPlayer.ScaleType.SURFACE_FIT_SCREEN
        it.setAudioOutput("audiotrack")
    }

    var source: VideoSource? = null
        set(value) {
            if (player.isReleased) return
            if (field == value) return
            if (field != null) player.stop()
            field = value
            videoInfo = null
            if (value != null) {
                val media = media(value.uri)
                player.media = media
                media.release()
                if (value.time != null) {
                    player.time = value.time
                }
            }
        }

    fun sourceChanged() = videoInfo == null && player.hasMedia()

    fun loadVideoInfo(): VideoInfo? {
        if (videoInfo != null) {
            return videoInfo
        }
        val videoTrack = player.getSelectedTrack(IMedia.Track.Type.Video) as VideoTrack?
        if (videoTrack != null) {
            this.videoInfo = VideoInfo(
                videoTrack.let { Track(it.id, it.name) },
                Dimensions(videoTrack.width, videoTrack.height),
                player.isSeekable,
                player.length,
                player.getTracks(IMedia.Track.Type.Audio).orEmpty().map { Track(it.id, it.name) },
                player.getTracks(IMedia.Track.Type.Text).orEmpty().map { Track(it.id, it.name) }
            )
        }
        return videoInfo
    }

    private fun media(uri: String): Media {
        if (uri.startsWith("http")) {
            return Media(libVLC, Uri.parse(uri.trim()))
        }
        return Media(libVLC, uri.trim())
    }

    fun release() {
        if (player.isReleased) return
        player.release()
        player.vlcVout.detachViews()
        libVLC.release()
        videoInfo = null
    }

    fun play(source: VideoSource? = null) {
        if (player.isReleased) return
        if (source != null) {
            videoInfo = null
            this.source = source
        }
        if (player.length == player.time) {
            player.time = 0
        }
        if (source?.time != null) {
            player.time = source.time
        }
        player.play()
    }

    fun progressInfo(): ProgressInfo {
        return ProgressInfo(player.time, player.position)
    }

    fun setTime(timeInMillis: Long) {
        val newValue = timeInMillis.coerceAtMost(player.length).coerceAtLeast(0)
        player.time = newValue
        view?.onProgress?.invoke(ProgressInfo(newValue, player.position))
    }

    fun setPosition(position: Float, fastSeeking: Boolean) {
        val newValue = (position.coerceAtMost(1f).coerceAtLeast(0f))
        player.setPosition(newValue, fastSeeking)
        view?.onProgress?.invoke(ProgressInfo(player.time, newValue))
    }

    fun pause() {
        if (player.isReleased) return
        player.pause()
    }

    fun stop() {
        if (player.isReleased) return
        player.stop()
    }
}
