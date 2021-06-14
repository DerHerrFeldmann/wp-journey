<?php
/*
Plugin Name:  IONOS SSO
Plugin URI:   https://www.ionos.com
Description:  SSO for WordPress
Version:
License:      GPLv2 or later
Author:       IONOS
Author URI:   https://www.ionos.com
Text Domain:  ionos-sso
@package ionos-sso
*/

namespace Ionos\Welcome;

// Do not allow direct access!

use function defined;
use function plugins_url;

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

/**
 * Helper class
 */
class Helper {
	/**
	 * Get the url of the css folder
	 *
	 * @param  string  $file  // css file name.
	 *
	 * @return string
	 */
	public static function get_css_url( $file = '' ) {
		return plugins_url( 'css/' . $file, __DIR__ );
	}

    /**
     * Get the url to the js folder.
     *
     * @param  string  $file  // js file name.
     *
     * @return string
     */
    public static function get_js_url( $file = '' ) {
        return plugins_url( 'js/' . $file, __DIR__ );
    }

    /**
     * Get the url to the js folder.
     *
     * @param  string  $file  // js file name.
     *
     * @return string
     */
    public static function get_json_path() {
        return plugin_dir_path( __DIR__ ) . 'config/config.json';
    }

    public static function get_js_path($file) {
        return plugin_dir_path( __DIR__ ) . 'js/' . $file;
    }
}
