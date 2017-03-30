<img src="https://raw.githubusercontent.com/WebVRRocks/moonrise/master/static/image/icon-256.png" alt="Moonrise" title="Moonrise" width="256">

# Moonrise

The next-generation WebVR browser.


## Supported platforms

* **[Windows](https://webvr.rocks/windows)** (as a WebVR browser, launcher, and development environment)
    * [HTC Vive](https://webvr.rocks/htc_vive)
    * [Oculus Rift](https://webvr.rocks/oculus_rift)
* **[macOS](https://webvr.rocks/mac)** (as a launcher and development environment; VR headsets are not yet supported)
* **[Linux](https://webvr.rocks/linux)** (coming soon, to support Valve's experimental Steam VR builds)



## Local development

### Installation

1. Install [Node.js](https://nodejs.org/en/download/package-manager/) (which includes [npm](https://www.npmjs.com/)), if you haven't already.
2. Clone this repository ([`WebVRRocks/moonrise`](https://github.com/WebVRRocks/moonrise)):

    ```bash
    mkdir -p webvrrocks
    git clone git@github.com:webvrrocks/moonrise.git webvrrocks/moonrise/
    ```
3. In the root directory of the cloned repository of the project, install the [Node](https://nodejs.org/en/download/package-manager/) dependencies:

    ```bash
    cd webvrrocks/moonrise/
    npm install
    ```

4. From the `webvrrocks/moonrise/` directory, run these commands:

    ```bash
    # Start application for local development (w/ live-reloading, error handling).
    npm start

    # Generate executable binaries for Windows and macOS.
    npm run package
    ```


### Local debugging

#### Browser extensions

Refer to [this page on MDN for debugging Firefox browser extensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging_(before_Firefox_50)).


## Acknowledgements

Thank you to the following projects and individuals:

* [Punk](https://github.com/scholtzm/punk) (Licensed under [MIT](https://github.com/scholtzm/punk/blob/master/LICENSE))


## Contributing

[Contributions are very welcome!](CONTRIBUTING.md)


## License

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/webvrrocks/moonrise)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
