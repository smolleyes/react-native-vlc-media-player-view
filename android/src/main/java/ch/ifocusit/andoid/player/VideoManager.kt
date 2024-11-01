package ch.ifocusit.andoid.player

object VideoManager {
    private var videoViews = mutableMapOf<Int, VideoView>()

    fun registerVideoView(videoView: VideoView) {
        videoViews[videoView.id] = videoView
    }

    fun unregisterVideoView(videoView: VideoView) {
        videoView.videoPlayer?.release()
        videoViews.remove(videoView.id)
    }

    fun onAppForegrounded() = Unit

    fun onAppBackgrounded() {
        for (videoView in videoViews.values) {
            if (videoView.videoPlayer?.staysActiveInBackground == false &&
                !videoView.willEnterPiP && !videoView.isInFullscreen
            ) {
                videoView.videoPlayer?.pause()
            }
        }
    }
}