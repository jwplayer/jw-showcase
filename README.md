# JW Showcase

JW Showcase is an open-source, dynamically generated video website built around JW Player and JW Platform services. It enables you to easily publish your JW Player-hosted video content with no coding and minimal configuration.

You can use JW Showcase with other content delivery platforms (or your own web server), but you will need to modify the source code.

## Supported Features

- Works with any JW Player edition, from Free to Enterprise (note that usage will count against your monthly JW streaming limits). Only cloud-hosted JW Players are supported.
- Populates your site's media content using JSON feeds. If you are using JW Platform, this happens auto-magically based on playlists that you specify. Using feeds from other sources will require you to hack the source code.
- Video titles, descriptions and hero images are populated from JW Platform JSON feed metadata.
- Playback of HLS video content from the JW Platform CDN. You can add external URLs (for example, URLS from your own server or CDN) to your playlists in the Content section of your JW Player account dashboard, but they must be HLS streams (`.m3u8` files).
- Customize the user interface with your own branding. The default app is configured for JW Player branding and content but you can easily change this to use your own assets by modifying the `config.json`. Advanced customization is possible (for example, editing the CSS files) , but you will need to modify the source code.
- Basic playback analytics reporting to your JW Dashboard.
- Ad integrations (VAST, VPAID, GoogleIMA, etc.)

### Unsupported Features

- Security-related features (encrypted HLS, DRM, signed URLs)
- Captions
- Search
- Self-hosted JW Players

## Instructions for Using JW Showcase

For full instructions, see the JW Showcase [Wiki pages](https://github.com/jwplayer/jw-showcase/wiki/):

* [Getting Started](https://github.com/jwplayer/JW Showcase/wiki/Getting-Started)
* [Deploying JW Showcase](https://github.com/jwplayer/JW Showcase/wiki/Deploying-jw-showcase)
* [Search Engines and Social Sharing](https://github.com/jwplayer/JW Showcase/wiki/Search-engines-and-social-sharing)

### Basic Setup

1. Download the latest [pre-compiled stable release](https://github.com/jwplayer/jw-showcase/releases).
2. Extract the release to your web server.

  ```
  $ tar -C /path/to/www/ -zxvf {pre-compiled-version}.gz
  ```

3. By default, JW Showcase assumes the site is in your top-level web document root (`/`). If you want to use a subdirectory (for example, /video/), edit the `index.html` file and replace the slash in &lt;base href="/"&gt; with your directory (for example, "/video/").
3. Create a player in the [JW Player Dashboard](https://dashboard.jwplayer.com/#/players) and get its `player key`.
    - The player key is the eight-character identifier of the player, not your JW Player license key. 
    - To get the player key, in the JW Dashboard go to **Players** &gt; **Tools**. In the **Cloud Hosted Player Libraries** section at the top of the page, select the player you want to use from the **Player Title** drop down. Then, in the **Cloud Player Library URL** field, copy the eight-character value that appears just before `.js`. This value is the Player key.
4. Create one or more video playlist(s) in the [JW Player Dashboard](https://dashboard.jwplayer.com/#/content/playlists) and record their eight-character playlist IDs.
5. Setup your site by editing the `config.json` file in the directory where you extracted the JW Showcase release files.
    - Use the player key from the previously step in the `player` field.
    - Use playlist IDs for the `featuredPlaylist` and `playlists` key.
6. Visit your site.

# Build from Source Code

Building from source is not required to create a JW Showcase site and should only be done by advanced users.

## Install Required Tools

Make sure you have [Node, NPM](https://nodejs.org) and [Compass](http://compass-style.org/) installed on your machine, then install Grunt and Bower globally using NPM.

```
$ npm i grunt-cli -g
$ npm i bower -g
```

Install NPM and Bower dependencies:

```
$ cd /path/to/source/
$ npm install
```

## Testing Locally

You can test your site in a local environment using Grunt. To start the Grunt livereload server on your local machine run `grunt serve`.

If you want to build the ready-to-release application run `grunt build`.

Use the `--url` option to define the URL of your location where the JW Showcase application will run. This will populate the `<base href="">` tag and `<meta property="og:image">` tags with your url.

```
$ grunt build --url=http://yourdomain.com/path/to/JWShowcase/
```

To deploy your site, copy the contents of the `dist/` folder to your web root and then follow the instructions in [Getting Started](https://github.com/jwplayer/JW Showcase/wiki/Getting-Started).

## Automated Testing

To run Protractor tests locally make sure you have an running selenium standalone server on port 4444. Then execute
the following command to start testing.

```
$ grunt test:protractor:local
```

To test in BrowserStack add the credentials to your environment variables.

```
$ export BROWSERSTACK_USER=username
$ export BROWSERSTACK_KEY=authkey
```

Then run the following Grunt task.

```
$ grunt test:protractor:browserstack
```

## Contributing

We welcome contributions to JW Showcase in the form of pull requests to our develop branch.

- [The seven rules of a great commit message](http://chris.beams.io/posts/git-commit/)
- [AngularJS styleguide](https://github.com/johnpapa/angular-styleguide/tree/master/a1)
