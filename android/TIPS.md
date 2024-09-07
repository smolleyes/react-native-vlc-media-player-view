
```kotlin
private val currentActivity = appContext.currentActivity ?: throw Exceptions.MissingActivity()
private val decorView = currentActivity.window.decorView
private val rootView = decorView.findViewById<ViewGroup>(android.R.id.content)
private val surfaceTexture = SurfaceView(context)
```

```kotlin
rootView.addView(
    surfaceTexture,
    FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
    )
)
```

```kotlin
player!!.vlcVout.setWindowSize(width, height)
surfaceTexture.holder.setKeepScreenOn(true)
```

```kotlin
private fun createText(text: String): TextView {
    val textView = TextView(context)
    textView.text = text
    textView.setTextColor(Color.RED)
    textView.textSize = 24f
    textView.setBackgroundColor(Color.BLACK)
    textView.setPadding(16, 16, 16, 16)
    textView.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    textView.gravity = Gravity.CENTER
    return textView
}
```

https://github.com/yuzhiyi/react-native-vlc-player/blob/master/android/vlc/src/main/java/com/ghondar/vlcplayer/PlayerActivity.java#L164
```java
final SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(this.getApplicationContext());
// Create LibVLC
// TODO: make this more robust, and sync with audio demo
ArrayList<String> options = new ArrayList<String>(50);
int deblocking = getDeblocking(-1);

int networkCaching = pref.getInt("network_caching_value", 0);
if (networkCaching > 60000)
    networkCaching = 60000;
else if (networkCaching < 0)
    networkCaching = 0;
//options.add("--subsdec-encoding <encoding>");
  /* CPU intensive plugin, setting for slow devices */
options.add("--audio-time-stretch");
options.add("--avcodec-skiploopfilter");
options.add("" + deblocking);
options.add("--avcodec-skip-frame");
options.add("0");
options.add("--avcodec-skip-idct");
options.add("0");
options.add("--subsdec-encoding");
//            options.add(subtitlesEncoding);
options.add("--stats");
/* XXX: why can't the default be fine ? #7792 */
if (networkCaching > 0)
    options.add("--network-caching=" + networkCaching);
options.add("--androidwindow-chroma");
options.add("RV32");

options.add("-vv");
```


