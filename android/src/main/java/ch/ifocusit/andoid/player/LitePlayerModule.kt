package ch.ifocusit.andoid.player

import ch.ifocusit.andoid.player.VideoPlayerModule.VideoSource
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class LitePlayerModule : Module() {

    override fun definition() = ModuleDefinition {
        Name("LitePlayerModule")

        View(PlayerView::class) {
            Prop("source") { view: PlayerView, source: VideoSource ->
                view.source = source
            }
            Prop("paused") { view: PlayerView, paused: Boolean ->
                if (paused) view.player.pause() else view.player.play()
            }
        }
    }
}
