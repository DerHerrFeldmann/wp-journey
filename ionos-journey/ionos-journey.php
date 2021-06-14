<?php
/*
Plugin Name:  IONOS Journey
Plugin URI:   https://www.ionos.com
Description:  Onboarding plugin
Version:
License:      GPLv2 or later
Author:       IONOS
Author URI:   https://www.ionos.com
Text Domain:  ionos-journey
*/
namespace Ionos\Welcome;

/**
 * Init plugin.
 *
 * @return void
 */
function init() {
    require_once 'inc/class-helper.php';
    require_once 'inc/class-settings.php';
    require_once 'inc/class-manager.php';

    new Manager();
}

\add_action( 'plugins_loaded', 'Ionos\Welcome\init' );

/**
 * Plugin translation.
 *
 * @return void
 */
function load_textdomain() {
    if ( false !== \strpos( \plugin_dir_path( __FILE__ ), 'mu-plugins' ) ) {
        \load_muplugin_textdomain(
            'ionos-welcome',
            \basename( \dirname( __FILE__ ) ) . '/languages'
        );
    } else {
        \load_plugin_textdomain(
            'ionos-welcome',
            false,
            \dirname( \plugin_basename( __FILE__ ) ) . '/languages/'
        );
    }
}

\add_action( 'init', 'Ionos\Welcome\load_textdomain' );