package ch.ifocusit.andoid.player

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
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

    var title: String? = null

    val staysActiveInBackground = false

    private var libVLC: LibVLC =
        if (config?.initOptions != null) LibVLC(context, config.initOptions) else LibVLC(context)

    private val videoLayout = VLCVideoLayout(context).also {
        it.setBackgroundColor(Color.BLACK)
    }

    internal var player: MediaPlayer = MediaPlayer(libVLC).also {
        it.attachViews(videoLayout, null, true, true)
        it.videoScale = MediaPlayer.ScaleType.SURFACE_FIT_SCREEN
    }

    var source: VideoSource? = null
        set(value) {
            field = value
            if (field != null) {
                player.stop()
                val media = media(field!!.uri)
                player.media = media
                media.release()
            }
        }

    var view: VideoView? = null
        set(value) {
            if (value != null) {
                field = value
                value.addView(videoLayout)
            }
        }

    fun videoInfo(): VideoInfo? {
        val videoTrack = player.getSelectedTrack(IMedia.Track.Type.Video) as VideoTrack?
        return if (videoTrack == null) null else VideoInfo(
            player.getSelectedTrack(IMedia.Track.Type.Video).let { Track(it.id, it.name) },
            Dimensions(
                videoTrack.width,
                videoTrack.height
            ),
            player.isSeekable,
            player.length,
            (player.getTracks(IMedia.Track.Type.Audio) ?: arrayOf()).map { Track(it.id, it.name) },
            (player.getTracks(IMedia.Track.Type.Text) ?: arrayOf()).map { Track(it.id, it.name) }
        )
    }

    private fun media(uri: String): Media {
        if (uri.startsWith("http")) {
            return Media(libVLC, Uri.parse(uri))
        }
        return Media(libVLC, uri)
    }

    fun release() {
        player.stop()
        player.release()
        player.vlcVout.detachViews()
        libVLC.release()
    }

    fun play(source: VideoSource?) {
        if (source != null) {
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
        val capped = timeInMillis.coerceAtMost(player.length).coerceAtLeast(0)
        player.time = capped
        view?.onProgress?.invoke(ProgressInfo(capped, player.position))
    }
}
