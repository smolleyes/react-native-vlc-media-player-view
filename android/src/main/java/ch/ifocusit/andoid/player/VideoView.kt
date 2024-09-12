package ch.ifocusit.andoid.player

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import ch.ifocusit.andoid.player.VideoPlayerModule.ProgressInfo
import ch.ifocusit.andoid.player.VideoPlayerModule.VideoInfo
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import org.videolan.libvlc.MediaPlayer.Event
import org.videolan.libvlc.interfaces.IMedia

@Suppress("SameParameterValue")
@SuppressLint("ViewConstructor")
class VideoView(context: Context, appContext: AppContext) : ExpoView(context, appContext),
    DefaultLifecycleObserver {

    private var videoInfo: VideoInfo? = null

    internal val onLoaded by EventDispatcher<VideoInfo>()
    internal val onProgress by EventDispatcher<ProgressInfo>()
    internal val onPaused by EventDispatcher<Boolean>()
    internal val onEnded by EventDispatcher<Unit>()
    private val onError by EventDispatcher<Unit>()

    var player: VlcPlayer? = null
        set(value) {
            field = value
            if (field != null) {
                field?.view = this
                listenPlayerEvents(field!!)
            }
        }

    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    }

    private fun listenPlayerEvents(sharedObject: VlcPlayer) {
        val player = sharedObject.player
        player.setEventListener { event ->
            run {
                when (event.type) {
                    Event.Buffering -> {
                        if (videoInfo == null) {
                            videoInfo = sharedObject.videoInfo()
                            val audioTracks = player.getTracks(IMedia.Track.Type.Audio)
                            if (videoInfo != null && audioTracks?.isNotEmpty() == true) {
                                onLoaded(videoInfo!!)
                            }
                        }
                    }

                    Event.EndReached -> {
                        onEnded(Unit)
                    }

                    Event.Playing -> {
                        val playing = player.isPlaying
                        onPaused(!playing)
                        this.keepScreenOn = playing
                    }

                    Event.TimeChanged -> {
                        onProgress(ProgressInfo(event.timeChanged, player.position))
                    }

                    Event.EncounteredError -> {
                        onError(Unit)
                    }
                }
            }
        }
    }

    override fun onPause(owner: LifecycleOwner) {
        player?.player?.pause()
    }

    override fun onStop(owner: LifecycleOwner) {
        player?.player?.stop()
    }

    override fun onDestroy(owner: LifecycleOwner) {
        player?.release()
    }
}
