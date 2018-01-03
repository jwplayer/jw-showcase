## 3.9.1 (January 3 2018)

- Fix scrolling to top of video page

## 3.9.0 (November 27 2017)

- Support linebreaks and Markdown headers in video description

## 3.8.0 (November 16 2017)

- [#125](http://github.com/jwplayer/jw-showcase/issues/125) Remove Bower
- Merge complete [jw-showcase-lib](http://github.com/jwplayer/jw-showcase-lib) into this repository
- Fix several Karma and Protractor tests
- Remove `siteName` from SEO title on video page

## 3.7.1 (October 20 2017)

- Fix compatibility with deprecation of skins in JW8
- Fix highlight color in stack icons

## 3.7.0 (October 17 2017)

- Updated URL structure
- Fix wrong SEO meta tags for tag state
- Fix sidebar not closing when clicking settings
- Fix settings sidebar item not having active state
- Fix sidebar not scrollable

## 3.7.0-beta (October 3 2017)

- Updated URL structure
- Added showcaseContentOnly option
- Added settings page
- Added browser upgrade page
- Removed enableGlobalSearch option

## 3.6.0 (September 6 2017)

- Renamed "Include captions" toggle to "Show caption matches"
- Fixed toggle not visible in dark and blue themes
- Fixed search input overlapping "Include captions" toggle
- Fixed "Copy link" text not visible in dark and blue themes

## 3.6.0-beta (August 29 2017)

- Added new display ad slot "below-rail" for mobile screen size
- Added in-video-search feature
- Right rail design changes
- Added enableAddToHome option

## 3.5.0 (August 1 2017)

- Fixed issue with auto scroll
- Fixed issue with right rail in IE11
- Fixed lazy load not working after breakpoint change
- Fixed card menus not closing when opening other card menu
- Relocated right rail ad
- Update DFP logic
- Disabled muted autostart for mobile devices

## 3.5.0-beta (July 26 2017)

- Updated right rail layout
- Updated "add to homescreen" dialog design
- Added support for DFP display ads

```
  "options": {
    "displayAds": {
      "client": "dfp",
      "slots": {
        "above-video": "/1234567/unit-identifier1",
        "below-video": "/1234567/unit-identifier2",
        "rail": "/1234567/unit-identifier3"
      }
    }
  }
```

- Added option to show all videos from your JW dashboard in the search results. By default the search results are
limited to only list the videos that are included in the content feeds in your Showcase config.

```
  "options": {
    ...
    "enableGlobalSearch": true
  }
```

- Added option choose the position of the video title. This can either be "above" or "below". By default this is
"below".

```
  "options": {
    ...
    "videoTitlePosition": "above"
  }
```

## 3.4.0 (June 21 2017)

- Added a 2:3 aspect ratio option for thumbnail images
- Fixed issue with lazy loading

## 3.4.0-beta (June 14 2017)

**New in this release:**
- Updated light theme
- Updated dark theme
- Added a new "blue" theme
- Added right side rail playlist to video watch page (displays the video's parent playlist to the right of the video player instead of as a shelf; can also be populated with JW Recommendations by specifying the useRecommendationPlaylist option in your config.json).
- Improve readability for screen readers
- Improve accessibility when using keyboard only (tab and arrow key navigation)
- Add support for upcoming JW thumbstrip format
- Added support for including clickable tags in video descriptions
- Add page for listing all videos with a specific tag
- Add support for highlightColor from config.json
- Update theme structure allowing you to customize themes more easily
- Added configuration options for changing the aspect ratio of a shelf's thumbnail images ("aspectRatio") and the number of images displayed in the shelf ("cols")

## 3.3.0 (May 24 2017)

**New in this release:**
- Updated to a new configuration model, see below for more details.
- Updated AngularJS to 1.6.4
- Updated dark theme
- Added add to homescreen plugin
- Added [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) support
- Enabled casting in player
- Fixed continue watching sorting in IE
- Fixed video auto scroll in Firefox

**Configuration update**

The configuration model has been updated to version 2. Previous configurations are still supported, but we
recommend updating your configuration to version 2. Support of the previous configuration will most likely be removed
in the next major release.

See the [example config](https://github.com/jwplayer/jw-showcase/blob/master/app/config.json) and [configuration wiki](https://github.com/jwplayer/jw-showcase/wiki/Getting-Started#configuration-parameters) for all available options.

## 3.2.0 (Apr 20 2017)

**New in this release:**
- Improved overall performance
- Added schema.org VideoObject tags to improve SEO
- Fixed player captions
- Fixed vtt.js error in Safari
- Fixed lazy load not always loading images in viewport
- Removed featured slider dot indicator

## 3.1.0 (Mar 3 2017)

**New in this release:**
- Optimized load time by loading the content playlists from JW Platform asynchronously.
- Sliders only render a minimum amount of cards to increase render time.
- Using v2 JW playlist endpoint to significantly decrease the playlist load time.
- Added lazy load to only load images that are currently visible.
- Added 'thumbstrip on mouseover' in Featured slider.
- Show thumb image of closest watch position in "Continue watching" slider.
- Disabled cookie notice by default, this can be re-enabled by adding `"enableCookieNotice": true` in the config.json.
- Updated page URL structure to include truncated video title, which improves SEO ranking.
- Added canonical META tag.
- Added `enableFeaturedText` option to enable/disable title and description text overlay in Featured slider.
- Added `enableHeader` option to enable/disable the site header (banner image, hamburger menu, etc), making it easier to embed a Showcase inside another web page.
- Added `enableJsScroll` option to enable/disable Javascript scrolling for the main content.
- Refactored the code to enable easier UI customization. See the documentation at [Customizing JW Showcase](https://github.com/jwplayer/jw-showcase/wiki/Customizing-JW-Showcase).
- Added lightweight markdown support for item descriptions. Currently supported: bold, italic and hyperlinks. To use, edit the video's description metadata in JW Dashboard.

**Example Markdown:**

```
*this is italic*
**this is bold**
[Link to JW Player](http://jwplayer.com "Title text")
```

## 3.0.1 (Jan 26 2017)

**New in this release:**
- Fixed JWPlayer display icons being stacked vertically in some cases.

## 3.0.0 (Dec 16 2016)

**New in this release:**
- Implemented a top-level "hamburger" style menu (issue #18 ) for easier navigation.
- Added a configuration option (enableContinueWatching, true or false) to globally disable the Continue Watching shelf (Issue #56 ).
- Added a "conserve bandwidth" setting for users who want to use less video data on mobile networks.
- Implemented site Search functionality (Issue #33 ). Users will only see the Search box if you specify a `searchPlaylist` ID in your `config.json`. This feature is powered by JW Recommendations and requires a JW Recommendations entitlement. For more information, see https://support.jwplayer.com/customer/portal/articles/2191721-jw-recommendations.
- Implemented a Related Videos shelf. Users will only see the Related Videos shelf if you specify a `recommendationsPlaylist` ID in your `config.json`. This feature is powered by JW Recommendations and requires a JW Recommendations entitlement. For more information, see https://support.jwplayer.com/customer/portal/articles/2191721-jw-recommendations.
- Re-architected the code to consolidate core Showcase functionality into a central library, (`jw-showcase-lib`, integrated as a Bower component).
- Fixed a number of bugs and added some minor features. See https://github.com/jwplayer/jw-showcase/issues?q=is%3Aissue+milestone%3A%22Q4+2016%22+is%3Aclosed

## 2.0.0 Saved videos and Continue watching (Sep 23 2016)

**New in this release:**
- A "watch list" feature for users to save videos for watching later. A separate list for "continue watching" is also kept so users can resume watching videos where they left off. The lists are per-browser at this time (i.e., the lists do not sync across user's devices).
- A new grid view for a particular playlist of videos, with the ability to deep-link to the playlist through a static URL.
- Thumbnail images in shelves are loaded on-demand instead of all on page load, saving substantial user bandwidth and improving page load speed.
- Improved the UX of video descriptions (moved below the video instead of as a player overlay).
- Implemented the new JW Player "Up Next" recommendations UX.

We also fixed a few bugs. For details, see the [closed issues for the 2.0 milestone](https://github.com/jwplayer/jw-showcase/milestone/2?closed=1)

## 1.1.0 Design update (Jul 29 2016)

**Page design changes:**
- In the Home page, the top carousel poster image in focus is now centered instead of offset to the left.
- In the View page, the height of the video's poster image has been reduced to show more of the "More like this" shelf.
- Made improvements to video description text area (cleaner text overflow and show/hide behavior).
- Shelves/playlists now include the number of content items in the list (Issue #1 ).
- On desktop browsers, uses 1920-wide poster images instead of 720 (issue #7 ).

**Miscellaneous:**
- Fixed issue #22
- Fixed issue #4
- Updated package.json with Apache license to fix grunt build warning ("EPACKAGEJSON jwshowcase@1.0.0 No license field").

## 1.0.0 Initial release (Jun 24 2016)

First release of the JW Showcase video web site builder. For instructions on setting up your JW Showcase site, see
the [Wiki](https://github.com/jwplayer/jw-showcase/wiki).
