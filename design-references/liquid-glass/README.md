# Approved Liquid Glass reference

Saved on 2026-10-11 following user approval. Use this material and interaction treatment as the reference for future portfolio components.

The adjacent CSS and JavaScript files are snapshots of the approved implementation. The working sources remain `javascript/control-center.css` and `javascript/ui/liquid-glass.js`; these snapshots are reference files, not additional runtime imports.

Preserve these characteristics:

- Clear transmitted background with a 12% neutral glass fill, 8px backdrop blur, and 150% saturation.
- Eight directional inset reflections, a thin edge highlight, and restrained floating shadows, as defined by `--glass-reflections`.
- Local pointer coordinates driving subtle specular highlights.
- Tactile compression and spring rebound, with reduced-motion support.
- Appearance selection tracking through `c-previous` and `c-current`, with a moving glass lens.
- The approved Control Center composition: 294px control area, 141px columns, 64px circular controls, and 12px gaps. The outer layout shell stays invisible.

Reuse the material across future components while adapting dimensions to their purpose. Keep functional buttons, accessible keyboard interaction, and readable contrast.

The material is based on the user's supplied Liquid Glass CSS example. Its JavaScript previous-selection tracking was adapted to the portfolio's existing buttons. The example's SVG filter URL is not used because the supplied CSS did not include its filter definition.
