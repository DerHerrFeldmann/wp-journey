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

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

/**
 * Manager class
 */
class Manager {
	public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_help_center_resources'));
        if( isset($_GET['wp_tour']) ) {
            add_action('admin_print_footer_scripts', array($this, 'get_json'));
        } else {
            add_action('admin_print_footer_scripts', array($this, 'add_start_button'));
        }
	}

    /**
     * Load internal resources
     */
    public function enqueue_help_center_resources() {
        wp_enqueue_style( 'ionos-welcome', \Ionos\Welcome\Helper::get_css_url( 'ionos-welcome.css' ));
    }

    public function get_json() {
        global $current_screen;

        $json = file_get_contents(\Ionos\Welcome\Helper::get_json_path());
        $main_js = file_get_contents(\Ionos\Welcome\Helper::get_js_path('ionos-journey.js'));
        $config_array = json_decode($json, true);

        if(isset($config_array[$current_screen->id]) && !empty($config_array[$current_screen->id])) {

            $result_js = '';

            $id = array_key_first($config_array[$current_screen->id]);

            $result_array = array();
            $runs = 0;
            do {
                if (isset($config_array[$current_screen->id][$id]) && $runs < count($config_array[$current_screen->id])) {
                    $result_array[strval($id)] = $config_array[$current_screen->id][$id];
                    $id = $config_array[$current_screen->id][$id]['next'];
                    $runs++;
                } else {
                    $id = null;
                }
            } while(!is_null($id));

            if(!empty($result_array)) {
                $result_js = sprintf(
                    $main_js,
                    json_encode($result_array)
                );
                echo '<script type="text/javascript"> ' . $result_js . '</script>';
            }
        }
    }

    public function add_start_button() {
        $start_js = file_get_contents(\Ionos\Welcome\Helper::get_js_path('parts/add_start.js'));
        echo '<script type="text/javascript"> ' . $start_js . '</script>';
    }

    private function get_random_word($len = 10) {
        $word = array_merge(range('a', 'z'), range('A', 'Z'));
        shuffle($word);
        return substr(implode($word), 0, $len);
    }
}