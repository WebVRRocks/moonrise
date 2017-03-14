# Moonrise

The next-generation WebVR browser.


## Supported platforms

* [Windows](https://webvr.rocks/windows)
    * [HTC Vive](https://webvr.rocks/htc_vive)
    * [Oculus Rift](https://webvr.rocks/oculus_rift)


## Local development

1. [Sign in to Valve's Steamworks site](https://partner.steamgames.com/) using your regular [Steam account](https://store.steampowered.com/join/).
2. Download the [Steamworks SDK (`steamworks_sdk_139.zip`)](https://partner.steamgames.com/downloads/steamworks_sdk_139.zip). (For older versions, refer to the [Release Archive](https://partner.steamgames.com/downloads/list).)
3. Sign up for a [Steam developer Web API key](https://steamcommunity.com/dev/apikey) for your domain name (e.g., `https://agent.webvr.rocks`).
4. Create a file named `.env` in the root directory of this project, and in the file paste that API key, defined as a environment variable, like so:
    ```bash
    STEAM_WEB_API_KEY="EF734F4BBFDD7FF86DAB390136591093"
    ```

4. Open Windows' search bar (by pressing the `Windows` key), and type `cmd` ("Command Prompt").
5. Right-click on the `Command Prompt` and click `Run as administrator` in the context menu. (Proceed by clicking the `Yes` button when the `User Account Control` modal prompt appears.)
6. Install [Node.js](https://nodejs.org/en/download/package-manager/) (which includes [npm](https://www.npmjs.com/)), if you haven't already.
7. Run this command to install the `npm` Node.js package, [`windows-build-tools`](https://github.com/felixrieseberg/windows-build-tools):
    ```bash
    Windows Build Tools
    npm install --global --production windows-build-tools
    ```

7. Clone this repository ([`WebVRRocks/moonrise`](https://github.com/WebVRRocks/moonrise)):
    ```bash
    mkdir -p webvrrocks
    git clone git@github.com:webvrrocks/moonrise.git webvrrocks/moonrise/
    ```

8. In the root directory of the cloned repository of the project, install the [Node](https://nodejs.org/en/download/package-manager/) dependencies:
    ```bash
    cd webvrrocks/moonrise/
    npm install
    ```

9. Extract the `steamworks_sdk_139.zip` file (downloaded from step 2).
10. Copy the `steamworks_sdk_139/sdk/` directory to `webvrrocks/moonrise/greenworks/`, and rename the `sdk` directory to `steamworks_sdk`.
11. From the `webvrrocks/moonrise/greenworks/` directory, run these commands:

    ```bash
    node-gyp configure
    node-gyp build
    ```


### Local debugging

1. Refer to [this page on MDN for debugging the Firefox browser extension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging_(before_Firefox_50)).


### Installation

#### Windows

1. Ensure [Node](https://nodejs.org/en/download/package-manager/) is installed.
2. Install the Node dependencies:

    ```bash
    npm install
    ```
3. Install [Git Bash](https://git-scm.com/downloads) for command-line usage.


## Acknowledgements

Thank you to the following projects and individuals:

* [Steamworks](http://www.steampowered.com/steamworks/) by [Valve](http://www.valvesoftware.com/)
* [Greenworks](https://github.com/greenheartgames/greenworks) (Licensed under [MIT](https://github.com/greenheartgames/greenworks/blob/master/LICENSE))



## Contributing

[Contributions are very welcome!](CONTRIBUTING.md)


## Licence

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/webvrrocks/moonrise)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
