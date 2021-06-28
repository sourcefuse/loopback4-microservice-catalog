export const prefix = `<vg-player><vg-overlay-play></vg-overlay-play><vg-buffering></vg-buffering>
<vg-scrub-bar><vg-scrub-bar-current-time></vg-scrub-bar-current-time><vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time></vg-scrub-bar>
<vg-controls><vg-play-pause></vg-play-pause> <vg-playback-button></vg-playback-button><vg-time-display vgProperty="current" vgFormat="mm:ss">
</vg-time-display><vg-scrub-bar style="pointer-events: none;"></vg-scrub-bar><vg-time-display vgProperty="left" vgFormat="mm:ss"></vg-time-display>
<vg-time-display vgProperty="total" vgFormat="mm:ss"></vg-time-display><vg-track-selector></vg-track-selector><vg-mute ></vg-mute><vg-volume></vg-volume>
<vg-fullscreen></vg-fullscreen></vg-controls>
<video width="100%" controls disablepictureinpicture controlslist="nodownload" [vgMedia]="$any(media)" #media id= "singleVideo" preload="auto" controls><source src = "`;
export const suffix = '"type = video/webm type="video/mp4"> </video></vg-player>';

