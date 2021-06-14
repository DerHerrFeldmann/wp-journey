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

use function __;
use function add_action;
use function add_settings_field;
use function add_settings_section;
use function checked;
use function defined;
use function get_option;
use function is_admin;
use function register_setting;
use function sprintf;

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

/**
 * Settings class.
 */
class Settings {
}
