package ch.ifocusit.andoid.player

import android.annotation.SuppressLint
import android.content.Context
import androidx.lifecycle.DefaultLifecycleObserver
import ch.ifocusit.andoid.player.VideoPlayerModule.ProgressInfo
import ch.ifocusit.andoid.player.VideoPlayerModule.VideoInfo
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import org.videolan.libvlc.MediaPlayer.Event

@Suppress("SameParameterValue")
@SuppressLint("ViewConstructor")
class VideoView(context: Context, appContext: AppContext) : ExpoView(context, appContext),
    DefaultLifecycleObserver {

    var willEnterPiP: Boolean = false
    var isInFullscreen: Boolean = false
        private set

    private val onLoaded by EventDispatcher<VideoInfo>()
    private val onLoading by EventDispatcher<Unit>()
    internal val onProgress by EventDispatcher<ProgressInfo>()
    private val onPaused by EventDispatcher<Boolean>()
    private val onEnded by EventDispatcher<Unit>()
    private val onError by EventDispatcher<Unit>()

    var videoPlayer: VlcPlayer? = null
        set(value) {
            if (field != null) {
                field?.release()
            }
            field = value
            if (field != null) {
                field?.view = this
                listenPlayerEvents(field!!)
            }
        }

    init {
        VideoManager.registerVideoView(this)
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    }

    private fun listenPlayerEvents(sharedObject: VlcPlayer) {
        val player = sharedObject.player
        player.setEventListener { event ->
            run {
                when (event.type) {
                    Event.Buffering -> {
                        if (sharedObject.sourceChanged()) {
                            val videoInfo = sharedObject.loadVideoInfo()
                            if (videoInfo != null) {
                                onLoaded(videoInfo)
                            } else {
                                onLoading(Unit)
                            }
                        }
                    }

                    Event.EndReached -> {
                        onEnded(Unit)
                        if (sharedObject.loop) {
                            player.setTime(0, false)
                            player.play()
                        }
                    }

                    Event.Playing, Event.Paused, Event.Stopped -> {
                        val playing = player.isPlaying
                        this.keepScreenOn = playing
                        onPaused(!playing)
                    }

                    Event.TimeChanged -> {
                        onProgress(ProgressInfo(event.timeChanged, player.position))
                    }

                    Event.PositionChanged -> {
                        onProgress(ProgressInfo(player.time, event.positionChanged))
                    }

                    Event.EncounteredError -> {
                        onError(Unit)
                    }
                }
            }
        }
    }
}
