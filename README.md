# NRGLAB Website

This is the source code for the [NRGLAB website](https://nrglab.uk). The current version of the website is built using Hugo.

## Contributing

Many changes can be done without downloading and setting up the project locally!

Simply be logged in on GitHub and modify the file directly from web interface to create a pull request. You may wish to create a new branch first if you need to make changes to multiple files.

Files in the `data` and `content` directories drive the content available on the site and use super-simple languages, making them ideal for editing in this way.

More complex changes, like changing layouts, styles, and JavaScript files, will mean you'll need to clone the project locally to test your changes. See [Set Up](#set-up).

## Set up

### Install Hugo

Hugo is a single executable file which you can acquire from the [releases page](https://github.com/gohugoio/hugo/releases). Use the latest extended version for your system.

If you're on 64 bit Windows, for example, download `hugo_extended_[version]_windows-amd64.zip`, extract the executable somewhere sensible, then add it to your PATH.

Alternatively, if you have a package manager available, use that instead.

For more info, see the [official installation instructions](https://gohugo.io/getting-started/installing/).

### Running Hugo

Hugo is a static site generator. Open your terminal and `cd` into the project folder, then run the command:

```sh
hugo
```

This will generate a static website in the `dist` directory.

While you're developing, use Hugo's live server which has file watching capabilities. Whenever changes are made to the project, the website will immediately reload to show changes.

```sh
hugo serve
```
