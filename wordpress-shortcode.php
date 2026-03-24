<?php
/**
 * Plugin Name: Font Generator Tool Shortcode
 * Description: Adds [font_generator_tool] shortcode to embed the Flask Font Generator.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function fg_tool_shortcode($atts = array()) {
    $atts = shortcode_atts(
        array(
            'src' => 'https://your-flask-domain.com/',
            'height' => '900',
        ),
        $atts,
        'font_generator_tool'
    );

    $src = esc_url($atts['src']);
    $height = intval($atts['height']);
    if ($height < 400) {
        $height = 400;
    }

    return '<div class="fg-tool-wrapper">' .
        '<iframe src="' . $src . '" loading="lazy" style="width:100%;height:' . $height . 'px;border:0;border-radius:12px;overflow:hidden;" title="Font Generator Tool"></iframe>' .
        '</div>';
}
add_shortcode('font_generator_tool', 'fg_tool_shortcode');
