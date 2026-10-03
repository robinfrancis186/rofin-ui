// Generated from catalog.json and the source examples by npm run build.
export default [
  {
    "id": "button",
    "title": "Button",
    "category": "Components",
    "description": "A clear next step, with four styles and three sizes.",
    "css": [
      "button"
    ],
    "js": [],
    "file": "examples/components/button.html",
    "notes": [
      "Use buttons for actions and links for navigation.",
      "Use the native disabled attribute on buttons. aria-disabled alone does not suppress link navigation.",
      "Icon-only buttons need an accessible name."
    ],
    "html": "<div class=\"rf-button-group\">\n  <button class=\"rf-button\" type=\"button\">Get started</button>\n  <button class=\"rf-button rf-button--outline\" type=\"button\">Learn more</button>\n  <button class=\"rf-button rf-button--ghost\" type=\"button\">Maybe later</button>\n  <button class=\"rf-button\" type=\"button\" disabled>Unavailable</button>\n</div>",
    "cssBytes": 1624
  },
  {
    "id": "card",
    "title": "Card",
    "category": "Components",
    "description": "A quiet surface for content, actions, and everything between.",
    "css": [
      "card",
      "button"
    ],
    "js": [],
    "file": "examples/components/card.html",
    "notes": [
      "The card is a container, not an interactive element. Put real links or buttons inside it.",
      "Use rf-card--interactive for a visual hover treatment."
    ],
    "html": "<article class=\"rf-card rf-card--elevated\">\n  <h3 class=\"rf-card__title\">A place for your next idea.</h3>\n  <p class=\"rf-card__description\">Give your content a little breathing room. Build on a simple, flexible surface.</p>\n  <div class=\"rf-card__footer\"><button class=\"rf-button\" type=\"button\">Explore possibilities</button></div>\n</article>",
    "cssBytes": 2517
  },
  {
    "id": "input",
    "title": "Input",
    "category": "Components",
    "description": "Native text fields with labels, help text, and error states.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/input.html",
    "notes": [
      "Always associate a visible label with the input.",
      "Set aria-invalid=\"true\" and aria-describedby to your error text when validation fails.",
      "Validation and submission remain your application’s responsibility."
    ],
    "html": "<div class=\"rf-stack\">\n  <div class=\"rf-field\">\n    <label class=\"rf-label\" for=\"input-name\">Your name</label>\n    <input class=\"rf-input\" id=\"input-name\" name=\"name\" autocomplete=\"name\" placeholder=\"Robin Francis\">\n  </div>\n  <div class=\"rf-field\">\n    <label class=\"rf-label\" for=\"input-email\">Email address</label>\n    <input class=\"rf-input\" id=\"input-email\" type=\"email\" autocomplete=\"email\" aria-describedby=\"email-help\" placeholder=\"you@example.com\">\n    <p class=\"rf-help\" id=\"email-help\">We’ll only use this to contact you about your account.</p>\n  </div>\n</div>",
    "cssBytes": 3093
  },
  {
    "id": "select",
    "title": "Select",
    "category": "Components",
    "description": "A native select that keeps platform keyboard and touch behavior.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/select.html",
    "notes": [
      "Native select styling varies slightly by browser and operating system.",
      "For simple autocomplete, consider native input with datalist before building a custom combobox."
    ],
    "html": "<div class=\"rf-field\">\n  <label class=\"rf-label\" for=\"select-team\">Team size</label>\n  <select class=\"rf-select\" id=\"select-team\" name=\"team\">\n    <option value=\"solo\">Just me</option><option value=\"small\">2–10 people</option><option value=\"large\">11–50 people</option>\n  </select>\n</div>",
    "cssBytes": 3093
  },
  {
    "id": "textarea",
    "title": "Textarea",
    "category": "Components",
    "description": "Room for a longer thought. Native resizing included.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/textarea.html",
    "notes": [
      "The field resizes vertically so its width stays inside the layout."
    ],
    "html": "<div class=\"rf-field\">\n  <label class=\"rf-label\" for=\"textarea-message\">Tell us about your project</label>\n  <textarea class=\"rf-textarea\" id=\"textarea-message\" name=\"message\" rows=\"4\" placeholder=\"Something wonderful starts here…\"></textarea>\n</div>",
    "cssBytes": 3093
  },
  {
    "id": "checkbox",
    "title": "Checkbox",
    "category": "Components",
    "description": "A native checkbox with a generous clickable label.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/checkbox.html",
    "notes": [
      "The wrapping label makes both the text and checkbox clickable."
    ],
    "html": "<label class=\"rf-check\"><input type=\"checkbox\" name=\"updates\" checked> Send me product updates</label>",
    "cssBytes": 3093
  },
  {
    "id": "radio",
    "title": "Radio group",
    "category": "Components",
    "description": "Mutually exclusive choices, grouped with native semantics.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/radio.html",
    "notes": [
      "Use the same name on the radio inputs.",
      "A fieldset and legend communicate the group’s purpose."
    ],
    "html": "<fieldset class=\"rf-fieldset\">\n  <legend>Choose a workspace</legend>\n  <div class=\"rf-stack\" style=\"--rf-gap: .25rem\">\n    <label class=\"rf-check\"><input type=\"radio\" name=\"workspace\" value=\"personal\" checked> Personal</label>\n    <label class=\"rf-check\"><input type=\"radio\" name=\"workspace\" value=\"team\"> Team</label>\n  </div>\n</fieldset>",
    "cssBytes": 3093
  },
  {
    "id": "switch",
    "title": "Switch",
    "category": "Components",
    "description": "A small on/off control built from a real checkbox.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/switch.html",
    "notes": [
      "The browser owns checked state and Space key behavior.",
      "Keep the label stable when toggled; it names the setting, not the current state."
    ],
    "html": "<label class=\"rf-check\"><input class=\"rf-switch\" type=\"checkbox\" role=\"switch\" name=\"notifications\" checked> Enable notifications</label>",
    "cssBytes": 3093
  },
  {
    "id": "range",
    "title": "Range",
    "category": "Components",
    "description": "A slider that works with keyboard, mouse, and touch.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/range.html",
    "notes": [
      "Arrow keys adjust the value. Home and End are provided by the browser.",
      "If you display the value separately, keep that display synchronized in your app."
    ],
    "html": "<div class=\"rf-field\">\n  <label class=\"rf-label\" for=\"range-volume\">Volume</label>\n  <input class=\"rf-range\" type=\"range\" id=\"range-volume\" min=\"0\" max=\"100\" value=\"65\">\n</div>",
    "cssBytes": 3093
  },
  {
    "id": "accordion",
    "title": "Accordion",
    "category": "Components",
    "description": "Expandable content using native details and summary.",
    "css": [
      "accordion"
    ],
    "js": [],
    "file": "examples/components/accordion.html",
    "notes": [
      "No JavaScript is required.",
      "Use details name=\"your-group\" for exclusive opening in browsers supporting grouped details."
    ],
    "html": "<div class=\"rf-accordion\">\n  <details open><summary>Does this need a framework?</summary><div class=\"rf-accordion__content\"><p>No. Use plain HTML and CSS. Add small JavaScript modules only for the interactions you need.</p></div></details>\n  <details><summary>Can I change the colors?</summary><div class=\"rf-accordion__content\"><p>Yes. Override the --rf-* design tokens to make it yours.</p></div></details>\n  <details><summary>What’s the license?</summary><div class=\"rf-accordion__content\"><p>MIT. Use it in personal or commercial projects and retain the license notice.</p></div></details>\n</div>",
    "cssBytes": 710
  },
  {
    "id": "tabs",
    "title": "Tabs",
    "category": "Components",
    "description": "Organize nearby content with keyboard navigation and native buttons.",
    "css": [
      "tabs"
    ],
    "js": [
      "tabs"
    ],
    "file": "examples/components/tabs.html",
    "notes": [
      "Left/Right, Home, and End move between tabs. Vertical tablists use Up/Down.",
      "Set data-rf-activation=\"manual\" to activate only on Enter, Space, or click.",
      "Use equal numbers of tabs and panels. aria-controls can map them explicitly.",
      "Without JS, all panels remain visible. After changing a tabset’s internal structure, destroy and initialize that root again."
    ],
    "html": "<div class=\"rf-tabs\" data-rf-tabs>\n  <div role=\"tablist\" aria-label=\"Workspace views\">\n    <button type=\"button\" role=\"tab\" aria-selected=\"true\">Overview</button>\n    <button type=\"button\" role=\"tab\">Activity</button>\n    <button type=\"button\" role=\"tab\">Settings</button>\n  </div>\n  <div role=\"tabpanel\"><h3>Your workspace, at a glance.</h3><p class=\"rf-muted\">Keep your projects and people together.</p></div>\n  <div role=\"tabpanel\"><h3>A little progress, every day.</h3><p class=\"rf-muted\">Your latest work appears here.</p></div>\n  <div role=\"tabpanel\"><h3>Make yourself at home.</h3><p class=\"rf-muted\">Customize the workspace to fit your flow.</p></div>\n</div>",
    "cssBytes": 873
  },
  {
    "id": "dropdown",
    "title": "Dropdown menu",
    "category": "Components",
    "description": "A native popover enhanced with focus, arrows, and typeahead.",
    "css": [
      "dropdown",
      "button"
    ],
    "js": [
      "dropdown"
    ],
    "file": "examples/components/dropdown.html",
    "notes": [
      "Requires native Popover API support.",
      "Arrow keys, Home/End, and typing move focus. Escape closes the menu.",
      "Use menu roles for application actions. For ordinary website navigation, use nav and links instead.",
      "Attach your application behavior to the menu item buttons."
    ],
    "html": "<div data-rf-dropdown>\n  <button class=\"rf-button rf-button--outline\" type=\"button\" popovertarget=\"actions-menu\">Project actions <span aria-hidden=\"true\">⌄</span></button>\n  <div class=\"rf-menu\" id=\"actions-menu\" popover role=\"menu\" aria-label=\"Project actions\">\n    <button type=\"button\" role=\"menuitem\">Edit project</button>\n    <button type=\"button\" role=\"menuitem\">Duplicate</button>\n    <hr class=\"rf-menu__separator\" role=\"separator\">\n    <button type=\"button\" role=\"menuitem\">Archive project</button>\n  </div>\n</div>",
    "cssBytes": 2620
  },
  {
    "id": "dialog",
    "title": "Dialog",
    "category": "Components",
    "description": "A modal with browser-managed focus trapping and Escape behavior.",
    "css": [
      "dialog",
      "button"
    ],
    "js": [
      "dialog"
    ],
    "file": "examples/components/dialog.html",
    "notes": [
      "Label every dialog with aria-labelledby or aria-label.",
      "The browser traps focus and closes on Escape.",
      "Backdrop clicks dismiss only when data-rf-backdrop-close is present.",
      "You can call showModal() directly instead of using the data attributes."
    ],
    "html": "<button class=\"rf-button\" type=\"button\" data-rf-dialog-open=\"welcome-dialog\">Open dialog</button>\n<dialog class=\"rf-dialog\" id=\"welcome-dialog\" aria-labelledby=\"welcome-title\" aria-describedby=\"welcome-description\" data-rf-backdrop-close>\n  <h2 class=\"rf-dialog__title\" id=\"welcome-title\">A fresh start.</h2>\n  <p class=\"rf-muted\" id=\"welcome-description\">Everything you need to build something thoughtful.</p>\n  <div class=\"rf-dialog__actions\"><button class=\"rf-button\" type=\"button\" data-rf-dialog-close autofocus>Sounds good</button></div>\n</dialog>",
    "cssBytes": 2436
  },
  {
    "id": "drawer",
    "title": "Drawer",
    "category": "Components",
    "description": "The native dialog, arranged as a full-height side panel.",
    "css": [
      "dialog",
      "form",
      "button"
    ],
    "js": [
      "dialog"
    ],
    "file": "examples/components/drawer.html",
    "notes": [
      "Uses the same native dialog behavior and API.",
      "This panel is a modal. For a persistent sidebar, use the Navigation component."
    ],
    "html": "<button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-dialog-open=\"settings-drawer\">Workspace settings</button>\n<dialog class=\"rf-dialog rf-dialog--drawer\" id=\"settings-drawer\" aria-labelledby=\"drawer-title\">\n  <h2 class=\"rf-dialog__title\" id=\"drawer-title\">Workspace settings</h2>\n  <p class=\"rf-muted\">Give your workspace a name that feels like you.</p>\n  <div class=\"rf-field\"><label class=\"rf-label\" for=\"drawer-name\">Workspace name</label><input class=\"rf-input\" id=\"drawer-name\" value=\"Studio\" autofocus></div>\n  <div class=\"rf-dialog__actions\"><button class=\"rf-button\" type=\"button\" data-rf-dialog-close>Done</button></div>\n</dialog>",
    "cssBytes": 5529
  },
  {
    "id": "tooltip",
    "title": "Tooltip",
    "category": "Components",
    "description": "A short hint on hover or focus, dismissible with Escape.",
    "css": [
      "tooltip",
      "button"
    ],
    "js": [
      "tooltip"
    ],
    "file": "examples/components/tooltip.html",
    "notes": [
      "Use aria-describedby to connect the hint to its trigger.",
      "Never put essential instructions or interactive controls only inside a tooltip.",
      "Tooltip positioning is local to its wrapper; avoid clipped containers and viewport edges.",
      "JS adds Escape dismissal; hover and focus display work with CSS alone."
    ],
    "html": "<span class=\"rf-tooltip\">\n  <button class=\"rf-button rf-button--outline\" type=\"button\" aria-describedby=\"shortcut-hint\">Save changes</button>\n  <span class=\"rf-tooltip__content\" id=\"shortcut-hint\" role=\"tooltip\">Save your current workspace settings</span>\n</span>",
    "cssBytes": 2343
  },
  {
    "id": "toast",
    "title": "Toast",
    "category": "Components",
    "description": "Text-only notifications with a dismiss button and paused timers.",
    "css": [
      "toast",
      "button"
    ],
    "js": [
      "toast"
    ],
    "file": "examples/components/toast.html",
    "notes": [
      "Messages are treated as text, never HTML.",
      "duration: 0 keeps the notification until dismissed. Default: 5000 ms.",
      "Hover, keyboard focus, and hidden browser tabs pause the timer.",
      "Do not rely on a timed toast as the only source of critical information.",
      "Toasts are outside modal dialogs; put important modal feedback inside the dialog."
    ],
    "sampleJS": "document.querySelector('[data-demo-toast]').addEventListener('click', () => {\n  toast('Your changes are saved.', { title: 'All set', variant: 'success', duration: 5000 });\n});",
    "html": "<button class=\"rf-button\" type=\"button\" data-demo-toast>Show notification</button>",
    "cssBytes": 2613
  },
  {
    "id": "badge",
    "title": "Badge",
    "category": "Components",
    "description": "Compact labels for status, metadata, and little milestones.",
    "css": [
      "badge"
    ],
    "js": [],
    "file": "examples/components/badge.html",
    "notes": [
      "Always communicate status with text; color alone isn’t enough."
    ],
    "html": "<div class=\"rf-cluster\">\n  <span class=\"rf-badge\"><span class=\"rf-badge__dot\" aria-hidden=\"true\"></span> New release</span>\n  <span class=\"rf-badge\" data-variant=\"success\">Published</span>\n  <span class=\"rf-badge\" data-variant=\"warning\">Draft</span>\n  <span class=\"rf-badge\" data-variant=\"danger\">Needs attention</span>\n</div>",
    "cssBytes": 798
  },
  {
    "id": "avatar",
    "title": "Avatar",
    "category": "Components",
    "description": "Initials or images, alone or in a small team.",
    "css": [
      "avatar"
    ],
    "js": [],
    "file": "examples/components/avatar.html",
    "notes": [
      "Give standalone initials a name using role=\"img\" and aria-label.",
      "For an image, use meaningful alt text or alt=\"\" when the adjacent text already identifies the person."
    ],
    "html": "<div class=\"rf-cluster\">\n  <span class=\"rf-avatar\" role=\"img\" aria-label=\"Robin Francis\">RF</span>\n  <div class=\"rf-avatar-group\" aria-label=\"Project team\">\n    <span class=\"rf-avatar\" role=\"img\" aria-label=\"Alex Morgan\">AM</span>\n    <span class=\"rf-avatar\" role=\"img\" aria-label=\"Jamie Lee\">JL</span>\n    <span class=\"rf-avatar\" role=\"img\" aria-label=\"Three more teammates\">+3</span>\n  </div>\n</div>",
    "cssBytes": 561
  },
  {
    "id": "alert",
    "title": "Alert",
    "category": "Components",
    "description": "Persistent feedback with a title, message, and semantic color.",
    "css": [
      "alert"
    ],
    "js": [],
    "file": "examples/components/alert.html",
    "notes": [
      "Use role=\"status\" when inserting a nonurgent update dynamically.",
      "Use role=\"alert\" for urgent errors, not for every static message."
    ],
    "html": "<div class=\"rf-alert\" data-variant=\"success\">\n  <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\"><path d=\"m5 12 4 4L19 6\"/></svg>\n  <div><strong class=\"rf-alert__title\">You’re ready to go.</strong><p>Your workspace has been created. Time to make something great.</p></div>\n</div>",
    "cssBytes": 724
  },
  {
    "id": "breadcrumb",
    "title": "Breadcrumb",
    "category": "Components",
    "description": "Show the route back using ordinary navigation links.",
    "css": [
      "breadcrumb"
    ],
    "js": [],
    "file": "examples/components/breadcrumb.html",
    "notes": [
      "Replace the example fragment links with your application’s real URLs.",
      "aria-current=\"page\" marks the current location."
    ],
    "html": "<nav class=\"rf-breadcrumb\" aria-label=\"Breadcrumb\">\n  <ol><li><a href=\"#home\">Home</a></li><li><a href=\"#projects\">Projects</a></li><li><span aria-current=\"page\">Rofin UI</span></li></ol>\n</nav>",
    "cssBytes": 414
  },
  {
    "id": "pagination",
    "title": "Pagination",
    "category": "Components",
    "description": "A clear way through a longer list. Navigation stays native.",
    "css": [
      "pagination"
    ],
    "js": [],
    "file": "examples/components/pagination.html",
    "notes": [
      "Your server or app owns page selection and result loading.",
      "Give previous/next controls meaningful accessible names."
    ],
    "html": "<nav class=\"rf-pagination\" aria-label=\"Results pages\">\n  <a href=\"?page=1\" aria-label=\"Previous page\">←</a>\n  <a href=\"?page=1\" aria-label=\"Page 1\">1</a><a href=\"?page=2\" aria-label=\"Page 2\" aria-current=\"page\">2</a><a href=\"?page=3\" aria-label=\"Page 3\">3</a>\n  <span class=\"rf-pagination__ellipsis\" aria-hidden=\"true\">…</span><a href=\"?page=10\" aria-label=\"Page 10\">10</a><a href=\"?page=3\" aria-label=\"Next page\">→</a>\n</nav>",
    "cssBytes": 676
  },
  {
    "id": "table",
    "title": "Table",
    "category": "Components",
    "description": "Readable native tables in a horizontal scroll container.",
    "css": [
      "table",
      "badge"
    ],
    "js": [],
    "file": "examples/components/table.html",
    "notes": [
      "Native table semantics are retained. Use caption, th, and scope.",
      "The focusable wrapper makes horizontal scrolling available by keyboard.",
      "Sorting, filtering, and virtualization are not part of this component."
    ],
    "html": "<div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Projects table\">\n  <table class=\"rf-table\"><caption>Your latest projects</caption>\n    <thead><tr><th scope=\"col\">Project</th><th scope=\"col\">Status</th><th scope=\"col\">Updated</th></tr></thead>\n    <tbody><tr><th scope=\"row\">Studio website</th><td><span class=\"rf-badge\" data-variant=\"success\">Published</span></td><td>Today</td></tr>\n    <tr><th scope=\"row\">Component library</th><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>Yesterday</td></tr></tbody>\n  </table>\n</div>",
    "cssBytes": 1461
  },
  {
    "id": "progress",
    "title": "Progress",
    "category": "Components",
    "description": "A native progress bar for an operation with a known total.",
    "css": [
      "progress"
    ],
    "js": [],
    "file": "examples/components/progress.html",
    "notes": [
      "Update the native value attribute as work progresses.",
      "Omit value for indeterminate progress; its appearance is browser-dependent."
    ],
    "html": "<div class=\"rf-field\"><label class=\"rf-label\" for=\"project-progress\">Project completion — 72%</label><progress class=\"rf-progress\" id=\"project-progress\" value=\"72\" max=\"100\">72%</progress></div>",
    "cssBytes": 679
  },
  {
    "id": "meter",
    "title": "Meter",
    "category": "Components",
    "description": "A native measurement inside a known range.",
    "css": [
      "progress"
    ],
    "js": [],
    "file": "examples/components/meter.html",
    "notes": [
      "Meter represents a measurement such as storage usage. Progress represents completion of work.",
      "Meter colors and rendering may vary by browser."
    ],
    "html": "<div class=\"rf-field\"><label class=\"rf-label\" for=\"storage-meter\">Storage used — 6 of 10 GB</label><meter class=\"rf-meter\" id=\"storage-meter\" value=\"6\" min=\"0\" max=\"10\" low=\"3\" high=\"8\" optimum=\"2\">6 GB</meter></div>",
    "cssBytes": 679
  },
  {
    "id": "spinner",
    "title": "Spinner",
    "category": "Components",
    "description": "A small loading indicator with a text alternative.",
    "css": [
      "loading"
    ],
    "js": [],
    "file": "examples/components/spinner.html",
    "notes": [
      "Include meaningful status text; the spinning shape is decorative.",
      "Reduced-motion preferences stop the animation."
    ],
    "html": "<span role=\"status\" class=\"rf-cluster\"><span class=\"rf-spinner\" aria-hidden=\"true\"></span><span>Loading your workspace…</span></span>",
    "cssBytes": 615
  },
  {
    "id": "skeleton",
    "title": "Skeleton",
    "category": "Components",
    "description": "A quiet placeholder while content is on its way.",
    "css": [
      "loading"
    ],
    "js": [],
    "file": "examples/components/skeleton.html",
    "notes": [
      "Hide decorative placeholders from assistive technology and provide one loading status.",
      "Remove the status when your content arrives."
    ],
    "html": "<div class=\"rf-stack\" role=\"status\" aria-label=\"Loading profile\">\n  <div class=\"rf-cluster\" aria-hidden=\"true\"><span class=\"rf-skeleton rf-skeleton--circle\"></span><div class=\"rf-stack\" style=\"flex:1; --rf-gap:.5rem\"><span class=\"rf-skeleton\" style=\"width:60%\"></span><span class=\"rf-skeleton\" style=\"width:40%\"></span></div></div>\n  <span class=\"rf-skeleton\" aria-hidden=\"true\"></span><span class=\"rf-skeleton\" aria-hidden=\"true\" style=\"width:80%\"></span>\n</div>",
    "cssBytes": 615
  },
  {
    "id": "upload",
    "title": "File input",
    "category": "Components",
    "description": "A real file picker with optional selected-file details.",
    "css": [
      "upload",
      "form"
    ],
    "js": [
      "upload"
    ],
    "file": "examples/components/upload.html",
    "notes": [
      "JS only lists selected file names and sizes.",
      "Uploads, MIME checks, limits, and server-side validation belong to your application.",
      "File names are inserted as text, not HTML."
    ],
    "html": "<div class=\"rf-upload\" data-rf-upload>\n  <label class=\"rf-label\" for=\"project-files\">Add files to your project</label>\n  <p class=\"rf-help\" id=\"files-help\">Choose one or more files. This demo lists them locally; it does not upload them.</p>\n  <input id=\"project-files\" type=\"file\" multiple aria-describedby=\"files-help\">\n  <ul class=\"rf-upload__files\" data-rf-file-list aria-live=\"polite\"></ul>\n</div>",
    "cssBytes": 3818
  },
  {
    "id": "navigation",
    "title": "Navigation",
    "category": "Components",
    "description": "Simple horizontal or vertical navigation using real links.",
    "css": [
      "navigation"
    ],
    "js": [],
    "file": "examples/components/navigation.html",
    "notes": [
      "Add rf-nav--vertical for sidebar navigation.",
      "Use aria-current=\"page\" only on the current destination."
    ],
    "html": "<nav class=\"rf-nav\" aria-label=\"Workspace navigation\"><a href=\"#overview\" aria-current=\"page\">Overview</a><a href=\"#projects\">Projects</a><a href=\"#team\">Team</a><a href=\"#settings\">Settings</a></nav>",
    "cssBytes": 615
  },
  {
    "id": "empty-state",
    "title": "Empty state",
    "category": "Components",
    "description": "Give an empty view a useful next step.",
    "css": [
      "empty-state",
      "button"
    ],
    "js": [],
    "file": "examples/components/empty-state.html",
    "notes": [
      "Explain why the view is empty and offer a relevant next action."
    ],
    "html": "<div class=\"rf-empty\">\n  <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M8 3v4m8-4v4M3 11h18m-9 3v4m-2-2h4\"/></svg>\n  <h3>A clean slate.</h3><p>No projects yet. Your first idea is a good place to start.</p><button class=\"rf-button\" type=\"button\">Create a project</button>\n</div>",
    "cssBytes": 2347
  },
  {
    "id": "layout",
    "title": "Layout",
    "category": "Components",
    "description": "Responsive grids, stacks, and clusters without a utility framework.",
    "css": [
      "layout",
      "card"
    ],
    "js": [],
    "file": "examples/components/layout.html",
    "notes": [
      "rf-grid adapts to its container. --rf-column sets the preferred minimum column width.",
      "rf-stack arranges content vertically; rf-cluster wraps a horizontal row.",
      "Override --rf-gap locally for consistent spacing."
    ],
    "html": "<div class=\"rf-grid\" style=\"--rf-column: 10rem; --rf-gap: .75rem\">\n  <div class=\"rf-card\">A little structure.</div><div class=\"rf-card\">Room to breathe.</div><div class=\"rf-card\">Made to adapt.</div>\n</div>",
    "cssBytes": 1958
  },
  {
    "id": "sortable-list",
    "title": "Sortable list",
    "category": "Components",
    "description": "Put useful things first: priorities, home-screen tiles and nested prototype steps.",
    "css": [
      "patterns",
      "form",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/sortable-list.html",
    "notes": [
      "Drag before or after an item on desktop. Native Move buttons provide keyboard and touch alternatives; focus stays with the moved item. Optional data-rf-sort-handle titles keep dragging separate from editable fields.",
      "rf:sort-change emits value, zero-based from/to, values, and previousValues once per committed move. Hidden inputs serialize the current DOM order. No API calls are made.",
      "Each root owns its direct list children, controls and status. IDs must be unique within that root. Nested roots sort independently; moving a parent preserves its fields and child order. data-rf-sort-axis=\"grid\" supports regular CSS grids with RTL reading order and vertical placement when stacked.",
      "Set data-rf-sort-disabled=\"true\" on a root/item for read-only moves. Native disabled controls and ancestor fieldsets are honored. Escape, pagehide, reset, disabling and teardown cancel unfinished drags without a commit.",
      "Native form reset restores all initial orders and field values unless cancelled. Teardown preserves committed order and restores original attributes/controls; destroy and reinitialize after structural changes. Virtualized/masonry layouts and cross-root nested transfers remain application work."
    ],
    "html": "<form class=\"rf-stack\" data-rf-sortable data-demo-form aria-labelledby=\"priority-title\" method=\"dialog\">\n  <div><h3 id=\"priority-title\">Make room for what matters first.</h3><p class=\"rf-help\">Drag a card above or below another, or use its Move buttons on keyboard and touch.</p></div>\n  <ol class=\"rf-sort-list\" data-rf-sort-list aria-label=\"Project priorities\">\n    <li data-rf-sort-item=\"brief\"><div><strong data-rf-item-label>Give the idea a shape.</strong><p class=\"rf-help\">Write the project brief.</p><input type=\"hidden\" name=\"priority\" value=\"brief\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Give the idea a shape. up\" hidden>↑ <span class=\"rf-sr-only\">Move up</span></button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Give the idea a shape. down\" hidden>↓ <span class=\"rf-sr-only\">Move down</span></button></div></li>\n    <li data-rf-sort-item=\"prototype\"><div><strong data-rf-item-label>Make something tangible.</strong><p class=\"rf-help\">Build the first prototype.</p><input type=\"hidden\" name=\"priority\" value=\"prototype\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Make something tangible. up\" hidden>↑ <span class=\"rf-sr-only\">Move up</span></button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Make something tangible. down\" hidden>↓ <span class=\"rf-sr-only\">Move down</span></button></div></li>\n    <li data-rf-sort-item=\"review\"><div><strong data-rf-item-label>Invite a fresh perspective.</strong><p class=\"rf-help\">Ask for a review.</p><input type=\"hidden\" name=\"priority\" value=\"review\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Invite a fresh perspective. up\" hidden>↑ <span class=\"rf-sr-only\">Move up</span></button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Invite a fresh perspective. down\" hidden>↓ <span class=\"rf-sr-only\">Move down</span></button></div></li>\n    <li data-rf-sort-item=\"launch\"><div><strong data-rf-item-label>Share your next chapter.</strong><p class=\"rf-help\">Prepare the launch.</p><input type=\"hidden\" name=\"priority\" value=\"launch\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Share your next chapter. up\" hidden>↑ <span class=\"rf-sr-only\">Move up</span></button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Share your next chapter. down\" hidden>↓ <span class=\"rf-sr-only\">Move down</span></button></div></li>\n  </ol>\n  <p class=\"rf-help\" role=\"status\">Four priorities. Changes stay in this example.</p><section class=\"rf-stack\" data-rf-sortable aria-labelledby=\"prototype-stage-title\"><div><h4 id=\"prototype-stage-title\">Give the prototype its stages.</h4><p class=\"rf-help\">Reorder stages and their nested steps independently.</p></div><ol class=\"rf-sort-list\" data-rf-sort-list aria-label=\"Prototype stages\"><li data-rf-sort-item=\"discovery\"><div><strong data-rf-item-label data-rf-sort-handle>Explore the idea</strong><input type=\"hidden\" name=\"prototype-stage\" value=\"discovery\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Explore the idea earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Explore the idea later\" hidden>↓ Later</button></div><div class=\"rf-stack rf-sort-list--nested\" data-rf-sortable aria-labelledby=\"prototype-steps-title\">\n  <h4 id=\"prototype-steps-title\">A small prototype checklist.</h4><p class=\"rf-help\">Sort these steps independently. Moving the parent keeps its checklist and note together.</p>\n  <ol class=\"rf-sort-list\" data-rf-sort-list aria-label=\"Prototype steps\"><li data-rf-sort-item=\"sketch\"><div><strong data-rf-item-label>Sketch the first screen</strong><input type=\"hidden\" name=\"prototype-step\" value=\"sketch\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Sketch the first screen earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Sketch the first screen later\" hidden>↓ Later</button></div></li><li data-rf-sort-item=\"test\"><div><strong data-rf-item-label>Test a real task</strong><input type=\"hidden\" name=\"prototype-step\" value=\"test\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Test a real task earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Test a real task later\" hidden>↓ Later</button></div></li><li data-rf-sort-item=\"share\"><div><strong data-rf-item-label>Share what you learned</strong><input type=\"hidden\" name=\"prototype-step\" value=\"share\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Share what you learned earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Share what you learned later\" hidden>↓ Later</button></div></li></ol>\n  <label class=\"rf-field\"><span class=\"rf-label\">Prototype note</span><input class=\"rf-input\" name=\"prototype-note\" value=\"Keep the first version small.\"></label><p class=\"rf-help\" role=\"status\">Three steps, with their own order.</p>\n</div></li><li data-rf-sort-item=\"build\"><div><strong data-rf-item-label data-rf-sort-handle>Build the first version</strong><input type=\"hidden\" name=\"prototype-stage\" value=\"build\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Build the first version earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Build the first version later\" hidden>↓ Later</button></div></li></ol><p class=\"rf-help\" role=\"status\">Two stages; their steps and notes move with them.</p></section>\n<section class=\"rf-stack\" data-rf-sortable data-rf-sort-axis=\"grid\" aria-labelledby=\"page-order-title\">\n  <div><h4 id=\"page-order-title\">Arrange a useful home screen.</h4><p class=\"rf-help\">Drag a tile before or after another, or choose Earlier/Later. Tiles follow reading order and stack on small screens.</p></div>\n  <ol class=\"rf-sort-list rf-sort-list--grid\" data-rf-sort-list aria-label=\"Home screen tiles\"><li data-rf-sort-item=\"overview\"><div><strong data-rf-item-label>Overview</strong><input type=\"hidden\" name=\"page-order\" value=\"overview\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Overview earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Overview later\" hidden>↓ Later</button></div></li><li data-rf-sort-item=\"projects\"><div><strong data-rf-item-label>Projects</strong><input type=\"hidden\" name=\"page-order\" value=\"projects\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Projects earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Projects later\" hidden>↓ Later</button></div></li><li data-rf-sort-item=\"notes\"><div><strong data-rf-item-label>Notes</strong><input type=\"hidden\" name=\"page-order\" value=\"notes\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Notes earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Notes later\" hidden>↓ Later</button></div></li><li data-rf-sort-item=\"files\"><div><strong data-rf-item-label>Files</strong><input type=\"hidden\" name=\"page-order\" value=\"files\"></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Files earlier\" hidden>↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Files later\" hidden>↓ Later</button></div></li></ol>\n  <p class=\"rf-help\" role=\"status\">Four tiles, separate from the project priorities.</p>\n</section>\n<div><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset order</button></div>\n</form>",
    "cssBytes": 19573
  },
  {
    "id": "kanban",
    "title": "Kanban board",
    "category": "Components",
    "description": "Move good ideas from a first draft to out in the world.",
    "css": [
      "patterns",
      "form",
      "badge",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/kanban.html",
    "notes": [
      "Drop a card before/after another or into an empty column. Native Move-to selects and Earlier/Later buttons provide keyboard/touch alternatives. Column titles are drag handles; native column buttons work on narrow screens. Counts, empty states and an owned live announcement update together.",
      "rf:kanban-change emits value, from/to column names, zero-based fromIndex/toIndex and values/previousValues records of column names to card IDs once per committed card move. Column ordering reuses the shared sorter and emits rf:sort-change. No-ops and cancellations emit no change; the application owns saving and rollback.",
      "Use unique card and column IDs, direct card-list children and matching native select values. A disabled Move-to select or ancestor fieldset makes its card read-only. The regular three-column grid stacks in narrow containers. Virtualized boards and moving nested items between roots are outside this small DOM example.",
      "Escape, pagehide, reset, disabling and teardown cancel unfinished drags. Native form reset restores initial card and column orders unless cancelled. Teardown preserves committed moves and restores controls/attributes; destroy and reinitialize after structural changes.",
      "The composed dashboard uses this component and the shared sorter. Card/column priorities remain separate per page-session workspace through project creation and archiving. Order-only reset preserves project statuses and note drafts. Reload restores sample data; authorized durable storage is application work."
    ],
    "html": "<form class=\"rf-stack rf-kanban\" data-rf-kanban data-rf-sortable data-rf-sort-axis=\"grid\" data-demo-form aria-labelledby=\"board-title\" method=\"dialog\">\n  <div><h3 id=\"board-title\">Move good ideas forward.</h3><p class=\"rf-help\">Drag cards above or below a task, or into an empty column. Reorder columns by their headings. Move fields and Earlier/Later buttons work on keyboard and touch; Escape cancels a drag.</p></div>\n  <div class=\"rf-kanban__columns\" data-rf-sort-list>\n    <section class=\"rf-kanban__column\" data-rf-kanban-column=\"Draft\" data-rf-sort-item=\"Draft\" aria-labelledby=\"board-column-0\"><h3 id=\"board-column-0\" data-rf-sort-handle><span data-rf-item-label>Draft</span> <span class=\"rf-badge\" data-rf-kanban-count>1</span></h3><div class=\"rf-cluster rf-kanban__order\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Draft column earlier\" hidden>← Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Draft column later\" hidden>Later →</button></div><ul class=\"rf-kanban__list\" data-rf-kanban-list aria-label=\"Draft projects\">\n        <li data-rf-kanban-item=\"project-3\"><strong data-rf-item-label>Brand refresh</strong><p class=\"rf-help\">Alex · 20 tasks</p><label class=\"rf-field\" data-rf-kanban-control hidden><span class=\"rf-label\">Move to<span class=\"rf-sr-only\"> for Brand refresh</span></span><select class=\"rf-select\" data-rf-kanban-move><option selected>Draft</option><option>In progress</option><option>Published</option></select></label><div class=\"rf-cluster rf-kanban__order\" data-rf-kanban-control hidden><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"-1\" aria-label=\"Move Brand refresh earlier\">↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"1\" aria-label=\"Move Brand refresh later\">↓ Later</button></div></li>\n      </ul><p class=\"rf-help\" data-rf-kanban-empty hidden>Nothing here yet. Make space for a new beginning.</p></section>\n    <section class=\"rf-kanban__column\" data-rf-kanban-column=\"In progress\" data-rf-sort-item=\"In progress\" aria-labelledby=\"board-column-1\"><h3 id=\"board-column-1\" data-rf-sort-handle><span data-rf-item-label>In progress</span> <span class=\"rf-badge\" data-rf-kanban-count>2</span></h3><div class=\"rf-cluster rf-kanban__order\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move In progress column earlier\" hidden>← Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move In progress column later\" hidden>Later →</button></div><ul class=\"rf-kanban__list\" data-rf-kanban-list aria-label=\"In progress projects\">\n        <li data-rf-kanban-item=\"project-2\"><strong data-rf-item-label>Mobile journal</strong><p class=\"rf-help\">Jamie · 3 tasks</p><label class=\"rf-field\" data-rf-kanban-control hidden><span class=\"rf-label\">Move to<span class=\"rf-sr-only\"> for Mobile journal</span></span><select class=\"rf-select\" data-rf-kanban-move><option>Draft</option><option selected>In progress</option><option>Published</option></select></label><div class=\"rf-cluster rf-kanban__order\" data-rf-kanban-control hidden><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"-1\" aria-label=\"Move Mobile journal earlier\">↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"1\" aria-label=\"Move Mobile journal later\">↓ Later</button></div></li>\n        <li data-rf-kanban-item=\"project-4\"><strong data-rf-item-label>Component library</strong><p class=\"rf-help\">Robin · 8 tasks</p><label class=\"rf-field\" data-rf-kanban-control hidden><span class=\"rf-label\">Move to<span class=\"rf-sr-only\"> for Component library</span></span><select class=\"rf-select\" data-rf-kanban-move><option>Draft</option><option selected>In progress</option><option>Published</option></select></label><div class=\"rf-cluster rf-kanban__order\" data-rf-kanban-control hidden><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"-1\" aria-label=\"Move Component library earlier\">↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"1\" aria-label=\"Move Component library later\">↓ Later</button></div></li>\n      </ul><p class=\"rf-help\" data-rf-kanban-empty hidden>Nothing here yet. Make space for a new beginning.</p></section>\n    <section class=\"rf-kanban__column\" data-rf-kanban-column=\"Published\" data-rf-sort-item=\"Published\" aria-labelledby=\"board-column-2\"><h3 id=\"board-column-2\" data-rf-sort-handle><span data-rf-item-label>Published</span> <span class=\"rf-badge\" data-rf-kanban-count>1</span></h3><div class=\"rf-cluster rf-kanban__order\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"-1\" aria-label=\"Move Published column earlier\" hidden>← Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-sort-move=\"1\" aria-label=\"Move Published column later\" hidden>Later →</button></div><ul class=\"rf-kanban__list\" data-rf-kanban-list aria-label=\"Published projects\">\n        <li data-rf-kanban-item=\"project-1\"><strong data-rf-item-label>Studio website</strong><p class=\"rf-help\">Robin · 12 tasks</p><label class=\"rf-field\" data-rf-kanban-control hidden><span class=\"rf-label\">Move to<span class=\"rf-sr-only\"> for Studio website</span></span><select class=\"rf-select\" data-rf-kanban-move><option>Draft</option><option>In progress</option><option selected>Published</option></select></label><div class=\"rf-cluster rf-kanban__order\" data-rf-kanban-control hidden><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"-1\" aria-label=\"Move Studio website earlier\">↑ Earlier</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-kanban-order=\"1\" aria-label=\"Move Studio website later\">↓ Later</button></div></li>\n      </ul><p class=\"rf-help\" data-rf-kanban-empty hidden>Nothing here yet. Make space for a new beginning.</p></section>\n  </div>\n  <p class=\"rf-help\" role=\"status\">Four sample projects. Changes stay in this example.</p><div><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset board</button></div>\n</form>",
    "cssBytes": 20371
  },
  {
    "id": "resizable-panels",
    "title": "Resizable panels",
    "category": "Components",
    "description": "Make room for your work with draggable dividers, native sliders and nested splits.",
    "css": [
      "patterns",
      "card",
      "form",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/resizable-panels.html",
    "notes": [
      "The plain HTML exposes readable panes and labelled native ranges; resizing and saving require enhancement. Enhancement adds a named separator controlling the first pane: arrows, Shift plus arrows, Home and End resize; Enter collapses/restores only when min is zero. Pointer dragging commits on release; Escape, pointer cancellation, disabling, geometry changes and teardown restore the prior split.",
      "Each root has exactly two direct panes. Nested roots own separate sliders and dividers. data-rf-panel-axis=\"y\" creates a height split; set --rf-panel-height on its panel container. Vertical panes scroll; horizontal panes stack below 36rem and retain their ratio for wider screens. Keep bounds, axis and pane markup fixed until cleanup/reinitialization.",
      "Optional data-rf-panel-storage saves only the numeric percentage in browser localStorage under rf-panel:<key>. Use distinct application/workspace keys. Invalid preferences are ignored; blocked storage leaves resizing usable. This does not persist notes, files or authorized application data.",
      "The optional data-rf-panel-reset button clears only that split. Native form reset restores both sliders and the textarea, unless cancelled. rf:panel-resize emits one committed value/previousValue/axis/source change; cancelled drags emit none. Cleanup removes generated handles, IDs and attributes and restores original inline grid variables."
    ],
    "html": "<form class=\"rf-stack rf-resizable\" data-rf-resizable data-rf-panel-storage=\"rofin-demo-panels\" data-demo-form aria-labelledby=\"panels-title\" method=\"dialog\">\n  <div><h3 id=\"panels-title\">A workspace that fits your focus.</h3><p class=\"rf-help\" id=\"panels-help\">Drag a divider, use its arrow keys, or adjust a slider. Home and End reach the limits; Escape cancels a drag. Width panels stack on small screens. Layouts are saved in this browser.</p></div>\n  <label class=\"rf-field\"><span class=\"rf-label\">First panel width</span><input class=\"rf-range\" type=\"range\" min=\"25\" max=\"75\" value=\"40\" step=\"1\" aria-controls=\"workspace-panels\" aria-describedby=\"panels-help\"><output class=\"rf-help\" data-rf-panel-size>40% first panel, 60% second panel</output></label>\n  <div class=\"rf-resizable__panels\" id=\"workspace-panels\">\n    <aside class=\"rf-card rf-stack\" aria-label=\"Project notes\"><strong>Give the idea a shape.</strong><p class=\"rf-muted\">A few notes, a clear direction, a little room to explore.</p><ul><li>Make it useful.</li><li>Keep it simple.</li><li>Invite a fresh perspective.</li></ul></aside>\n    <article class=\"rf-stack rf-resizable\" data-rf-resizable data-rf-panel-axis=\"y\" data-rf-panel-storage=\"rofin-demo-panels-editor\" aria-label=\"Prototype workspace\">\n      <label class=\"rf-field\"><span class=\"rf-label\">Preview panel height</span><input class=\"rf-range\" type=\"range\" min=\"20\" max=\"80\" value=\"35\" step=\"1\" aria-controls=\"prototype-panels\"><output class=\"rf-help\" data-rf-panel-size>35% first panel, 65% second panel</output></label>\n      <div class=\"rf-resizable__panels\" id=\"prototype-panels\" data-rf-panel-axis=\"y\" style=\"--rf-panel-first:35fr;--rf-panel-second:65fr;--rf-panel-height:26rem\">\n        <section class=\"rf-card rf-stack\" aria-label=\"Prototype preview\" tabindex=\"0\"><h4 style=\"margin:0\">Make something tangible.</h4><p>Build the smallest thing that helps someone. Give the preview or your next step more room.</p></section>\n        <label class=\"rf-card rf-field\"><span class=\"rf-label\">Your next step</span><textarea class=\"rf-textarea\" name=\"notes\" rows=\"6\">Prepare the first prototype for review.</textarea></label>\n      </div>\n      <p class=\"rf-help\" role=\"status\" data-rf-panel-status></p>\n    </article>\n  </div>\n  <p class=\"rf-help\" role=\"status\" data-rf-panel-status></p>\n  <div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-panel-reset>Reset panel width</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset workspace</button></div>\n</form>",
    "cssBytes": 20466
  },
  {
    "id": "line-chart",
    "title": "Line chart",
    "category": "Components",
    "description": "Explore exact values, zoom the visible window, and update a trend from your own data.",
    "css": [
      "patterns",
      "card",
      "form",
      "table",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/line-chart.html",
    "notes": [
      "Original SVG and native data table use a shared linear scale including zero. Solid and dashed paths distinguish series without relying on color; hiding a series keeps the scale stable.",
      "Native ranges select an exact point and zoom from the first to the last visible point. Show all points restores the full view; Follow newest point explicitly pans on updates. The table always retains every accepted point.",
      "After initPatterns(chart), updateLineChart(chart, rows, { append: true }) accepts { label, values } records for the fixed series keys. Omit append to replace. Invalid updates return false and retain previous data. Use at most 512 unique labels (100 characters each), eight series and finite numeric values bounded by 1e12; appends keep the latest 512 points.",
      "Table headings, matching SVG paths and checkboxes define the fixed series. Change series markup only after teardown. Native form reset restores the view of current accepted data; teardown keeps a readable plot/table and rejects late API calls. Without scripts the initial SVG and exact native table remain available.",
      "The gallery separately uses examples/chart-demo.js for explicit illustrative browser updates and a real localhost HTTP stream. Start, Pause and Restore control its lifecycle; failure retains data, hidden pages and teardown close the feed, and static hosting disables HTTP. The library starts no requests; applications supply authorized feeds, history and aggregation for larger datasets."
    ],
    "html": "<figure class=\"rf-card rf-chart\" data-rf-line-chart>\n  <figcaption>A steady climb, with room to grow.</figcaption><p class=\"rf-help\">Initial sample active members, April–September. Solid line: active members; dashed line: target. Shared linear scale includes zero.</p>\n  <svg class=\"rf-line-plot\" data-rf-line-plot viewBox=\"0 0 560 240\" aria-hidden=\"true\">\n    <line x1=\"32\" y1=\"20\" x2=\"528\" y2=\"20\"/><line x1=\"32\" y1=\"110\" x2=\"528\" y2=\"110\"/><line x1=\"32\" y1=\"200\" x2=\"528\" y2=\"200\"/>\n    <polyline data-rf-line-series=\"active\" points=\"32,140 131.2,105 230.4,122.5 329.6,70 428.8,80 528,20\"/><polyline class=\"rf-line-target\" data-rf-line-series=\"target\" points=\"32,125 131.2,112.5 230.4,100 329.6,87.5 428.8,75 528,62.5\"/>\n    <line data-rf-line-cursor x1=\"32\" x2=\"32\" y1=\"20\" y2=\"200\"/>\n    <text x=\"32\" y=\"228\" text-anchor=\"middle\">Apr</text><text x=\"131.2\" y=\"228\" text-anchor=\"middle\">May</text><text x=\"230.4\" y=\"228\" text-anchor=\"middle\">Jun</text><text x=\"329.6\" y=\"228\" text-anchor=\"middle\">Jul</text><text x=\"428.8\" y=\"228\" text-anchor=\"middle\">Aug</text><text x=\"528\" y=\"228\" text-anchor=\"middle\">Sep</text>\n  </svg>\n  <div class=\"rf-stack\" data-rf-line-controls hidden><div class=\"rf-cluster\"><label class=\"rf-check\"><input type=\"checkbox\" data-rf-line-toggle=\"active\" checked>Active members · solid</label><label class=\"rf-check\"><input type=\"checkbox\" data-rf-line-toggle=\"target\" checked>Target · dashed</label></div><label class=\"rf-field\"><span class=\"rf-label\">Chart month</span><input class=\"rf-range\" type=\"range\" min=\"0\" max=\"5\" value=\"0\" step=\"1\" data-rf-line-range></label><div class=\"rf-cluster\"><label class=\"rf-field\"><span class=\"rf-label\">First chart point</span><input class=\"rf-range\" type=\"range\" min=\"0\" max=\"5\" value=\"0\" step=\"1\" data-rf-line-start></label><label class=\"rf-field\"><span class=\"rf-label\">Last chart point</span><input class=\"rf-range\" type=\"range\" min=\"0\" max=\"5\" value=\"5\" step=\"1\" data-rf-line-end></label></div><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-line-reset>Show all points</button><label class=\"rf-check\"><input type=\"checkbox\" data-rf-line-follow>Follow newest point</label></div><p class=\"rf-help\" data-rf-line-window></p><p class=\"rf-help\" data-rf-line-readout>April: Active members 24; Target 30</p></div>\n  <p class=\"rf-help\" data-rf-line-empty hidden>No data to show.</p><p class=\"rf-help\" data-rf-line-status role=\"status\"></p>\n  <div class=\"rf-stack\" data-rf-chart-demo-controls hidden><p class=\"rf-help\">Try changing the data. The browser feed generates illustrative values only. The localhost option receives the same kind of sample through a real HTTP stream; it is unavailable on static hosting.</p><label class=\"rf-field\"><span class=\"rf-label\">Sample chart source</span><select class=\"rf-select\" data-rf-chart-source><option value=\"browser\">Browser sample</option><option value=\"http\">Local HTTP stream</option></select></label><div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-chart-add>Add a sample point</button><button class=\"rf-button\" type=\"button\" data-rf-chart-stream>Start sample stream</button><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-chart-restore>Restore sample data</button></div><p class=\"rf-help\" data-rf-chart-demo-status role=\"status\">Updates start only when you choose them.</p></div>\n  <details><summary>View line chart data</summary><div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Active member chart data\"><table class=\"rf-table\"><caption>Active members and targets</caption><thead><tr><th scope=\"col\">Month</th><th scope=\"col\" data-rf-line-series=\"active\">Active members</th><th scope=\"col\" data-rf-line-series=\"target\">Target</th></tr></thead><tbody><tr><th scope=\"row\">April</th><td>24</td><td>30</td></tr><tr><th scope=\"row\">May</th><td>38</td><td>35</td></tr><tr><th scope=\"row\">June</th><td>31</td><td>40</td></tr><tr><th scope=\"row\">July</th><td>52</td><td>45</td></tr><tr><th scope=\"row\">August</th><td>48</td><td>50</td></tr><tr><th scope=\"row\">September</th><td>72</td><td>55</td></tr></tbody></table></div></details>\n</figure>",
    "cssBytes": 21129
  },
  {
    "id": "bar-chart",
    "title": "Bar chart",
    "category": "Components",
    "description": "See the trend, then open the exact values.",
    "css": [
      "card",
      "patterns",
      "table"
    ],
    "js": [],
    "file": "examples/components/bar-chart.html",
    "notes": [
      "The decorative bars are hidden from assistive technology; a labelled native details disclosure contains the exact data table.",
      "Set --rf-bar to value / maximum × 100%; keep the chart and table in sync. This static example has a zero baseline."
    ],
    "html": "<figure class=\"rf-card rf-chart\">\n  <figcaption>Six months of momentum</figcaption>\n  <p class=\"rf-help\">Completed tasks per month. Sample data; scale starts at zero.</p>\n  <ul class=\"rf-chart__bars\" aria-hidden=\"true\">\n    <li><strong>18</strong><i style=\"--rf-bar:30%\"></i><span>Apr</span></li>\n    <li><strong>30</strong><i style=\"--rf-bar:50%\"></i><span>May</span></li>\n    <li><strong>24</strong><i style=\"--rf-bar:40%\"></i><span>Jun</span></li>\n    <li><strong>42</strong><i style=\"--rf-bar:70%\"></i><span>Jul</span></li>\n    <li><strong>36</strong><i style=\"--rf-bar:60%\"></i><span>Aug</span></li>\n    <li><strong>60</strong><i style=\"--rf-bar:100%\"></i><span>Sep</span></li>\n  </ul>\n  <details><summary>View chart data</summary><div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Task chart data\"><table class=\"rf-table\"><caption>Completed tasks, April–September</caption><thead><tr><th scope=\"col\">Month</th><th scope=\"col\">Tasks</th></tr></thead><tbody><tr><th scope=\"row\">April</th><td>18</td></tr><tr><th scope=\"row\">May</th><td>30</td></tr><tr><th scope=\"row\">June</th><td>24</td></tr><tr><th scope=\"row\">July</th><td>42</td></tr><tr><th scope=\"row\">August</th><td>36</td></tr><tr><th scope=\"row\">September</th><td>60</td></tr></tbody></table></div></details>\n</figure>",
    "cssBytes": 16412
  },
  {
    "id": "donut-chart",
    "title": "Donut chart",
    "category": "Components",
    "description": "A clear part-to-whole view, with a readable legend.",
    "css": [
      "card",
      "patterns"
    ],
    "js": [],
    "file": "examples/components/donut-chart.html",
    "notes": [
      "SVG is decorative; visible text provides every value without relying on color.",
      "Use nonnegative parts of a whole and update the SVG dash values and legend together. No chart dependency or automatic calculations."
    ],
    "html": "<figure class=\"rf-card rf-chart\">\n  <figcaption>Make space for the work ahead.</figcaption>\n  <p class=\"rf-help\">Sample task distribution. The legend carries the same values as the chart.</p>\n  <div class=\"rf-chart__ring\">\n    <svg viewBox=\"0 0 120 120\" aria-hidden=\"true\"><circle class=\"rf-chart__track\" cx=\"60\" cy=\"60\" r=\"45\" fill=\"none\" stroke-width=\"12\"/><circle class=\"rf-chart__value\" cx=\"60\" cy=\"60\" r=\"45\" fill=\"none\" stroke-width=\"12\" pathLength=\"100\" stroke-dasharray=\"72 28\" transform=\"rotate(-90 60 60)\"/><text x=\"60\" y=\"67\" text-anchor=\"middle\">72%</text></svg>\n    <ul class=\"rf-chart__legend\"><li><span>Completed</span><strong>72 tasks · 72%</strong></li><li><span>Remaining</span><strong>28 tasks · 28%</strong></li><li><span>Total</span><strong>100 tasks</strong></li></ul>\n  </div>\n</figure>",
    "cssBytes": 15749
  },
  {
    "id": "date-range",
    "title": "Date range",
    "category": "Components",
    "description": "Two native dates, with a sensible order.",
    "css": [
      "card",
      "form",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/date-range.html",
    "notes": [
      "The optional initializer sets the end date minimum from the start date; native validation prevents reversed ranges.",
      "Inputs submit YYYY-MM-DD values. Your application chooses time zone, inclusive endpoints, and server validation."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-rf-date-range data-demo-form method=\"dialog\">\n  <fieldset class=\"rf-fieldset\"><legend>Reporting period</legend><div class=\"rf-grid\" style=\"--rf-column:12rem\">\n    <label class=\"rf-field\"><span class=\"rf-label\">Start date</span><input class=\"rf-input\" type=\"date\" name=\"start\" value=\"2026-09-01\" data-rf-date-start required></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">End date</span><input class=\"rf-input\" type=\"date\" name=\"end\" value=\"2026-09-30\" data-rf-date-end required></label>\n  </div><p class=\"rf-help\" style=\"margin-top:1rem\">The end date must be on or after the start date.</p></fieldset>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Apply dates</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset dates</button></div>\n</form>",
    "cssBytes": 5610
  },
  {
    "id": "paginated-table",
    "title": "Paginated table",
    "category": "Components",
    "description": "Find the right work with search, status filters, sorting, and paging.",
    "css": [
      "form",
      "button",
      "table",
      "badge",
      "patterns",
      "empty-state"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/paginated-table.html",
    "notes": [
      "Local pagination uses the initial tbody rows; filtering and sorting reset to page one.",
      "data-rf-table-filter=\"status\" matches each row’s data-rf-status exactly; other attribute keys work the same way.",
      "Search, filters, and row selection use native inputs. Reset returns form fields and page to their defaults; sorting stays as chosen.",
      "For new or removed rows, clean up and initialize again. Use server pagination and virtualization for large datasets."
    ],
    "html": "<form class=\"rf-stack\" data-rf-data-table data-demo-form aria-labelledby=\"paged-title\" method=\"dialog\">\n  <div><h3 id=\"paged-title\">A clear view of your projects.</h3><p class=\"rf-help\">Search, filter, sort, and page through six sample projects.</p></div>\n  <div class=\"rf-table-toolbar\"><label class=\"rf-field\"><span class=\"rf-label\">Search projects</span><input class=\"rf-input\" type=\"search\" data-rf-table-search placeholder=\"Name or owner…\"></label><label class=\"rf-field\"><span class=\"rf-label\">Project status</span><select class=\"rf-select\" data-rf-table-filter=\"status\"><option value=\"\">All statuses</option><option>Published</option><option>In progress</option><option>Draft</option></select></label><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset filters</button></div>\n  \n  <div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Paginated projects\"><table class=\"rf-table\"><caption>Six sample projects. Sorting applies to all matching rows, before pagination.</caption><thead><tr><th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"text\">Project <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th><th scope=\"col\">Owner</th><th scope=\"col\">Status</th><th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"number\">Tasks <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th></tr></thead><tbody><tr data-rf-status=\"Published\"><th scope=\"row\">Studio website</th><td>Robin</td><td><span class=\"rf-badge\" data-variant=\"success\">Published</span></td><td>12</td></tr><tr data-rf-status=\"In progress\"><th scope=\"row\">Mobile journal</th><td>Jamie</td><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>3</td></tr><tr data-rf-status=\"Draft\"><th scope=\"row\">Brand refresh</th><td>Alex</td><td><span class=\"rf-badge\" data-variant=\"info\">Draft</span></td><td>20</td></tr><tr data-rf-status=\"In progress\"><th scope=\"row\">Component library</th><td>Robin</td><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>8</td></tr><tr data-rf-status=\"Draft\"><th scope=\"row\">Customer portal</th><td>Jamie</td><td><span class=\"rf-badge\" data-variant=\"info\">Draft</span></td><td>16</td></tr><tr data-rf-status=\"Published\"><th scope=\"row\">Onboarding flow</th><td>Alex</td><td><span class=\"rf-badge\" data-variant=\"success\">Published</span></td><td>6</td></tr></tbody></table></div>\n  <div class=\"rf-empty\" data-rf-table-empty hidden><strong>No projects match.</strong><p>Try another search or reset the filters.</p></div>\n  <div class=\"rf-table-toolbar\"><label class=\"rf-field\" style=\"flex:0 1 9rem\"><span class=\"rf-label\">Rows per page</span><select class=\"rf-select\" data-rf-table-page-size><option value=\"3\">3</option><option value=\"6\">6</option></select></label><p class=\"rf-help\" role=\"status\" data-rf-table-status>6 sample projects</p><nav class=\"rf-cluster\" aria-label=\"Table pages\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-table-previous disabled>Previous page</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-table-next disabled>Next page</button></nav></div>\n</form>",
    "cssBytes": 21757
  },
  {
    "id": "bulk-actions",
    "title": "Bulk selection",
    "category": "Components",
    "description": "Select this page. Keep the selection as you explore.",
    "css": [
      "form",
      "button",
      "table",
      "badge",
      "patterns",
      "empty-state"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/bulk-actions.html",
    "notes": [
      "Select this page affects only visible enabled row checkboxes. Selection persists across paging and filtering; the count includes hidden rows.",
      "Give every data-rf-table-select checkbox a unique value and accessible label. The header checkbox reports partial selection.",
      "rf:table-selection exposes detail.values. rf:table-action exposes detail.action and detail.values; your app owns authorization, confirmation, and the real action."
    ],
    "html": "<form class=\"rf-stack\" data-rf-data-table data-demo-form aria-labelledby=\"bulk-title\" method=\"dialog\">\n  <div><h3 id=\"bulk-title\">The work, together.</h3><p class=\"rf-help\">Select this page or individual rows. Selections stay selected across pages and filters.</p></div>\n  <div class=\"rf-table-toolbar\"><label class=\"rf-field\"><span class=\"rf-label\">Search projects</span><input class=\"rf-input\" type=\"search\" data-rf-table-search placeholder=\"Name or owner…\"></label><label class=\"rf-field\"><span class=\"rf-label\">Project status</span><select class=\"rf-select\" data-rf-table-filter=\"status\"><option value=\"\">All statuses</option><option>Published</option><option>In progress</option><option>Draft</option></select></label><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset filters</button></div>\n  <div class=\"rf-cluster\"><p class=\"rf-help\" role=\"status\" data-rf-table-selected>0 selected across all pages</p><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-table-action=\"review\" disabled>Review selected</button></div>\n  <div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Selectable projects\"><table class=\"rf-table\"><caption>Six sample projects. Sorting applies to all matching rows, before pagination.</caption><thead><tr><th scope=\"col\"><label class=\"rf-check\"><input type=\"checkbox\" data-rf-table-select-all><span class=\"rf-sr-only\">Select this page</span></label></th><th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"text\">Project <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th><th scope=\"col\">Owner</th><th scope=\"col\">Status</th><th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"number\">Tasks <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th></tr></thead><tbody><tr data-rf-status=\"Published\"><td><label class=\"rf-check\"><input type=\"checkbox\" name=\"projects\" value=\"project-1\" data-rf-table-select><span class=\"rf-sr-only\">Select Studio website</span></label></td><th scope=\"row\">Studio website</th><td>Robin</td><td><span class=\"rf-badge\" data-variant=\"success\">Published</span></td><td>12</td></tr><tr data-rf-status=\"In progress\"><td><label class=\"rf-check\"><input type=\"checkbox\" name=\"projects\" value=\"project-2\" data-rf-table-select><span class=\"rf-sr-only\">Select Mobile journal</span></label></td><th scope=\"row\">Mobile journal</th><td>Jamie</td><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>3</td></tr><tr data-rf-status=\"Draft\"><td><label class=\"rf-check\"><input type=\"checkbox\" name=\"projects\" value=\"project-3\" data-rf-table-select><span class=\"rf-sr-only\">Select Brand refresh</span></label></td><th scope=\"row\">Brand refresh</th><td>Alex</td><td><span class=\"rf-badge\" data-variant=\"info\">Draft</span></td><td>20</td></tr><tr data-rf-status=\"In progress\"><td><label class=\"rf-check\"><input type=\"checkbox\" name=\"projects\" value=\"project-4\" data-rf-table-select><span class=\"rf-sr-only\">Select Component library</span></label></td><th scope=\"row\">Component library</th><td>Robin</td><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>8</td></tr><tr data-rf-status=\"Draft\"><td><label class=\"rf-check\"><input type=\"checkbox\" name=\"projects\" value=\"project-5\" data-rf-table-select><span class=\"rf-sr-only\">Select Customer portal</span></label></td><th scope=\"row\">Customer portal</th><td>Jamie</td><td><span class=\"rf-badge\" data-variant=\"info\">Draft</span></td><td>16</td></tr><tr data-rf-status=\"Published\"><td><label class=\"rf-check\"><input type=\"checkbox\" name=\"projects\" value=\"project-6\" data-rf-table-select><span class=\"rf-sr-only\">Select Onboarding flow</span></label></td><th scope=\"row\">Onboarding flow</th><td>Alex</td><td><span class=\"rf-badge\" data-variant=\"success\">Published</span></td><td>6</td></tr></tbody></table></div>\n  <div class=\"rf-empty\" data-rf-table-empty hidden><strong>No projects match.</strong><p>Try another search or reset the filters.</p></div>\n  <div class=\"rf-table-toolbar\"><label class=\"rf-field\" style=\"flex:0 1 9rem\"><span class=\"rf-label\">Rows per page</span><select class=\"rf-select\" data-rf-table-page-size><option value=\"3\">3</option><option value=\"6\">6</option></select></label><p class=\"rf-help\" role=\"status\" data-rf-table-status>6 sample projects</p><nav class=\"rf-cluster\" aria-label=\"Table pages\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-table-previous disabled>Previous page</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-table-next disabled>Next page</button></nav></div>\n</form>",
    "cssBytes": 21757
  },
  {
    "id": "notification-center",
    "title": "Notification center",
    "category": "Components",
    "description": "A small inbox for the things worth knowing.",
    "css": [
      "button",
      "badge",
      "patterns"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/notification-center.html",
    "notes": [
      "Native popover supports Escape and light dismissal; this is a content region, not an ARIA menu.",
      "Mark all read changes local markup and emits rf:notifications-read with detail.values. Connect persistence yourself."
    ],
    "html": "<div class=\"rf-notifications\" data-rf-notifications>\n  <button class=\"rf-button rf-button--outline\" type=\"button\" popovertarget=\"inbox-preview\">Notifications <span class=\"rf-badge\" data-rf-notifications-count>2</span><span class=\"rf-sr-only\"> unread</span></button>\n  <section class=\"rf-notifications__panel\" id=\"inbox-preview\" popover aria-labelledby=\"inbox-title\">\n    <div class=\"rf-cluster\" style=\"justify-content:space-between\"><h3 id=\"inbox-title\" style=\"margin:0\">Your inbox</h3><button class=\"rf-button rf-button--ghost rf-button--small\" type=\"button\" data-rf-notifications-read>Mark all read</button></div>\n    <ul class=\"rf-notifications__list\">\n      <li data-rf-unread data-rf-notification-id=\"review\"><strong>Ready for your review</strong> <span class=\"rf-badge\" data-rf-notification-state>Unread</span><p class=\"rf-help\">Jamie shared the mobile journal design.</p><time class=\"rf-help\" datetime=\"2026-10-02T09:00:00+05:30\">Today, 9:00 AM</time></li>\n      <li data-rf-unread data-rf-notification-id=\"milestone\"><strong>A milestone worth sharing</strong> <span class=\"rf-badge\" data-rf-notification-state>Unread</span><p class=\"rf-help\">Your team completed 72 of 100 tasks.</p><time class=\"rf-help\" datetime=\"2026-10-01T16:00:00+05:30\">Yesterday, 4:00 PM</time></li>\n    </ul>\n    <p class=\"rf-help\" role=\"status\"></p>\n    <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" popovertarget=\"inbox-preview\" popovertargetaction=\"hide\">Close inbox</button>\n  </section>\n</div>",
    "cssBytes": 17278
  },
  {
    "id": "website-header",
    "title": "Responsive website header",
    "category": "Sections",
    "description": "Clear destinations on desktop, a native menu on mobile.",
    "css": [
      "sections",
      "navigation",
      "button"
    ],
    "js": [],
    "file": "sections/website-header.html",
    "notes": [
      "A container query switches to a native details menu when this header is narrow, including inside a preview.",
      "Replace sample hash links with real destinations. The full landing example connects them to page sections."
    ],
    "html": "<header class=\"rf-site-header\">\n  <div class=\"rf-site-header__inner\">\n    <a class=\"rf-site-header__brand\" href=\"#home\">Studio<span class=\"rf-muted\"> / a place to begin</span></a>\n    <nav class=\"rf-nav rf-site-header__nav\" aria-label=\"Website\"><a href=\"#features\">Features</a><a href=\"#pricing\">Pricing</a><a href=\"#contact\">Contact</a><a class=\"rf-button\" href=\"#get-started\">Get started →</a></nav>\n    <details class=\"rf-site-menu\"><summary class=\"rf-button rf-button--outline\">Menu</summary><nav class=\"rf-nav rf-nav--vertical\" aria-label=\"Mobile website\"><a href=\"#features\">Features</a><a href=\"#pricing\">Pricing</a><a href=\"#contact\">Contact</a><a href=\"#get-started\">Get started →</a></nav></details>\n  </div>\n</header>",
    "cssBytes": 6251
  },
  {
    "id": "app-shell",
    "title": "Application shell",
    "category": "Sections",
    "description": "A home for your sidebar, top bar, and everyday work.",
    "css": [
      "sections",
      "navigation",
      "card",
      "button",
      "avatar",
      "badge"
    ],
    "js": [],
    "file": "sections/app-shell.html",
    "notes": [
      "The shell collapses to one column when its container is narrow. Native details lets people collapse navigation without JavaScript.",
      "Use a main landmark for application content in a complete page; this embedded preview uses a section. Set aria-current for your actual route."
    ],
    "html": "<div class=\"rf-app-frame\"><div class=\"rf-app-shell\">\n  <details class=\"rf-app-sidebar\" open><summary>Studio workspace</summary><nav class=\"rf-nav rf-nav--vertical\" aria-label=\"Application\"><a href=\"#overview\" aria-current=\"page\">Overview</a><a href=\"#projects\">Projects</a><a href=\"#team\">Team</a><a href=\"#settings\">Settings</a></nav></details>\n  <div class=\"rf-app-content\"><header class=\"rf-app-topbar\"><strong>Your workspace</strong><div class=\"rf-cluster\"><span class=\"rf-badge\" data-variant=\"success\">All systems ready</span><span class=\"rf-avatar\" role=\"img\" aria-label=\"Robin Francis\">RF</span></div></header>\n    <section class=\"rf-app-main rf-stack\" aria-label=\"Workspace overview\"><p class=\"rf-eyebrow\">Room for your next idea</p><h3>A little progress, every day.</h3><div class=\"rf-card\"><p>Compose your cards, charts, tables, and forms in this responsive shell.</p><a class=\"rf-button\" href=\"#projects\">View projects →</a></div></section>\n  </div>\n</div></div>",
    "cssBytes": 8503
  },
  {
    "id": "dashboard-metrics",
    "title": "Dashboard metrics",
    "category": "Sections",
    "description": "The numbers that matter, with context for every change.",
    "css": [
      "sections",
      "card",
      "badge"
    ],
    "js": [],
    "file": "sections/dashboard-metrics.html",
    "notes": [
      "Sample data. Labels, units, direction, and comparison period are visible without color.",
      "Compute metrics and trends from your application data; never imply these figures are live."
    ],
    "html": "<section aria-label=\"Sample dashboard metrics\"><div class=\"rf-grid\" style=\"--rf-column:12rem\">\n  <article class=\"rf-card\"><dl class=\"rf-kpi\"><dt>Monthly revenue</dt><dd class=\"rf-stat\">$12,480</dd></dl><p class=\"rf-help\"><span class=\"rf-badge\" data-variant=\"success\">↑ 12%</span> vs. last month</p></article>\n  <article class=\"rf-card\"><dl class=\"rf-kpi\"><dt>Active projects</dt><dd class=\"rf-stat\">24</dd></dl><p class=\"rf-help\"><span class=\"rf-badge\">+3</span> launched this week</p></article>\n  <article class=\"rf-card\"><dl class=\"rf-kpi\"><dt>Customer retention</dt><dd class=\"rf-stat\">96.2%</dd></dl><p class=\"rf-help\"><span class=\"rf-badge\" data-variant=\"warning\">↓ 0.8 points</span> vs. last month</p></article>\n</div></section>",
    "cssBytes": 5703
  },
  {
    "id": "account-settings",
    "title": "Account settings",
    "category": "Sections",
    "description": "Profile details and notification preferences, together.",
    "css": [
      "sections",
      "card",
      "form",
      "button"
    ],
    "js": [],
    "file": "sections/account-settings.html",
    "notes": [
      "Native reset discards unsaved edits. The gallery save is a form preview and sends no request.",
      "The composed dashboard saves workspace preferences locally for this session; use a server for real account updates."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\">\n  <div><h3 class=\"rf-card__title\">A workspace that feels like you.</h3><p class=\"rf-muted\">Sample account settings. Save and reset use native form controls.</p></div>\n  <div class=\"rf-grid\"><label class=\"rf-field\"><span class=\"rf-label\">Display name</span><input class=\"rf-input\" name=\"name\" value=\"Robin Francis\" autocomplete=\"name\" maxlength=\"80\" required></label><label class=\"rf-field\"><span class=\"rf-label\">Email address</span><input class=\"rf-input\" name=\"email\" type=\"email\" value=\"robin@example.com\" autocomplete=\"email\" required></label></div>\n  <label class=\"rf-field\"><span class=\"rf-label\">Time zone</span><select class=\"rf-select\" name=\"timezone\"><option value=\"Asia/Kolkata\">India · Asia/Kolkata</option><option value=\"Europe/London\">United Kingdom · Europe/London</option><option value=\"America/New_York\">United States · America/New_York</option><option value=\"UTC\">UTC</option></select></label>\n  <fieldset class=\"rf-fieldset\"><legend>Notifications</legend><div class=\"rf-stack\"><label class=\"rf-check\"><input class=\"rf-switch\" type=\"checkbox\" role=\"switch\" name=\"updates\" checked>Project updates</label><label class=\"rf-check\"><input class=\"rf-switch\" type=\"checkbox\" role=\"switch\" name=\"digest\">Weekly digest</label></div></fieldset>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Save preferences</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Discard changes</button></div><p class=\"rf-help\">Preview only. Connect save to your account service.</p>\n</form>",
    "cssBytes": 9622
  },
  {
    "id": "sign-up",
    "title": "Sign up",
    "category": "Sections",
    "description": "A considered first step into your product.",
    "css": [
      "sections",
      "card",
      "form",
      "button",
      "patterns"
    ],
    "js": [
      "patterns"
    ],
    "file": "sections/sign-up.html",
    "notes": [
      "Preview only; do not enter real credentials. Connect authentication, policy, rate limits, and server validation.",
      "Replace terms and privacy links with your own published policies."
    ],
    "html": "<section class=\"rf-card rf-auth\"><h3>Your next chapter starts here.</h3><p class=\"rf-muted\">A simple account creation form.</p>\n  <form data-demo-form method=\"dialog\"><label class=\"rf-field\"><span class=\"rf-label\">Full name</span><input class=\"rf-input\" name=\"name\" autocomplete=\"name\" required></label><label class=\"rf-field\"><span class=\"rf-label\">Email</span><input class=\"rf-input\" name=\"email\" type=\"email\" autocomplete=\"email\" required></label>\n    <div class=\"rf-field\" data-rf-password><label class=\"rf-label\" for=\"signup-password\">Create password</label><div class=\"rf-input-action\"><input class=\"rf-input\" id=\"signup-password\" name=\"password\" type=\"password\" autocomplete=\"new-password\" minlength=\"8\" aria-describedby=\"signup-help\" required><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-password-toggle aria-label=\"Show password\" aria-controls=\"signup-password\" aria-pressed=\"false\" hidden>Show</button></div><p class=\"rf-help\" id=\"signup-help\">Example minimum: 8 characters. Apply your own server policy.</p></div>\n    <label class=\"rf-check\"><input type=\"checkbox\" name=\"terms\" required><span>I agree to the <a href=\"#terms\">terms</a> and <a href=\"#privacy\">privacy policy</a>.</span></label><button class=\"rf-button\" type=\"submit\">Create account</button>\n  </form><p class=\"rf-help\" style=\"margin-top:1rem\">Preview only. Do not enter a real password. Authentication requires your backend.</p>\n</section>",
    "cssBytes": 24478
  },
  {
    "id": "password-reset",
    "title": "Password reset",
    "category": "Sections",
    "description": "A simple path back to an account.",
    "css": [
      "sections",
      "card",
      "form",
      "button"
    ],
    "js": [],
    "file": "sections/password-reset.html",
    "notes": [
      "This preview sends no email. Your server must generate, expire, and validate reset tokens.",
      "Return the same request response for known and unknown accounts; keep the actual recovery service separate from this UI."
    ],
    "html": "<section class=\"rf-card rf-auth\"><h3>A fresh start.</h3><p class=\"rf-muted\">Enter your email to request a password reset.</p><form data-demo-form method=\"dialog\"><label class=\"rf-field\"><span class=\"rf-label\">Account email</span><input class=\"rf-input\" type=\"email\" name=\"email\" autocomplete=\"email\" required></label><button class=\"rf-button\" type=\"submit\">Request reset link</button></form><p class=\"rf-help\" style=\"margin-top:1rem\">Preview only. No email is sent. Your server must generate, expire, and validate reset tokens; return the same response for known and unknown accounts.</p></section>",
    "cssBytes": 9622
  },
  {
    "id": "password-field",
    "title": "Password reveal",
    "category": "Components",
    "description": "A native password field with an explicit reveal toggle and reset protection.",
    "css": [
      "patterns",
      "form",
      "button",
      "card"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/password-field.html",
    "notes": [
      "Reveal is opt-in. The native password input works before JavaScript initializes.",
      "The toggle has a stable accessible name and aria-pressed state. Reset and teardown conceal the password.",
      "This interface is not authentication or a password-strength policy. Use sample text in the preview."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form style=\"max-width:30rem\" method=\"dialog\">\n  <p class=\"rf-eyebrow\">A small detail. A little less friction.</p>\n  <h3 class=\"rf-card__title\">See what you’re typing.</h3>\n  <div class=\"rf-field\" data-rf-password>\n    <label class=\"rf-label\" for=\"reveal-password\">Password</label>\n    <div class=\"rf-input-action\">\n      <input class=\"rf-input\" id=\"reveal-password\" name=\"password\" type=\"password\" autocomplete=\"new-password\" minlength=\"8\" required aria-describedby=\"reveal-help\">\n      <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-password-toggle aria-label=\"Show password\" aria-controls=\"reveal-password\" aria-pressed=\"false\" hidden>Show</button>\n    </div>\n    <p class=\"rf-help\" id=\"reveal-help\">Use a sample password of at least 8 characters. This demo sends nothing.</p>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Try the form</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Reset</button></div>\n</form>",
    "cssBytes": 20466
  },
  {
    "id": "character-counter",
    "title": "Character counter",
    "category": "Components",
    "description": "A compact profile composer with a native limit and a live count.",
    "css": [
      "patterns",
      "form",
      "button",
      "card"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/character-counter.html",
    "notes": [
      "The counter follows native maxlength, which counts UTF-16 code units. Some emoji use more than one unit.",
      "The count is descriptive help rather than a live-region announcement for every keystroke.",
      "Values remain local. Native form reset updates the count."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form style=\"max-width:34rem\" method=\"dialog\">\n  <p class=\"rf-eyebrow\">Make every word count.</p>\n  <h3 class=\"rf-card__title\">A little introduction.</h3>\n  <div class=\"rf-field\" data-rf-counter>\n    <label class=\"rf-label\" for=\"profile-bio\">Your bio</label>\n    <textarea class=\"rf-textarea\" id=\"profile-bio\" name=\"bio\" maxlength=\"160\" rows=\"3\" placeholder=\"What do you love making?\" aria-describedby=\"bio-help bio-count\"></textarea>\n    <div class=\"rf-cluster\" style=\"justify-content:space-between\"><p class=\"rf-help\" id=\"bio-help\">Keep it short. Make it you.</p><p class=\"rf-help rf-count\" id=\"bio-count\" data-rf-count>Up to 160 characters.</p></div>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Preview profile</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Start over</button></div>\n</form>",
    "cssBytes": 20466
  },
  {
    "id": "tag-input",
    "title": "Tag input",
    "category": "Components",
    "description": "Add and remove tags with keyboard entry, removable chips, and native form values.",
    "css": [
      "patterns",
      "form",
      "button",
      "card"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/tag-input.html",
    "notes": [
      "Enter adds a tag without submitting the form; IME composition is preserved.",
      "Duplicate tags are compared without case. The example allows five tags of 32 characters.",
      "Hidden inputs submit repeated values under data-rf-tags-name. Read them with FormData.getAll().",
      "Emits rf:tags-change with detail.values when adding or removing. Reset restores the initial tags. Validate values again on your server."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form style=\"max-width:34rem\" method=\"dialog\">\n  <p class=\"rf-eyebrow\">A few words. A clearer picture.</p>\n  <h3 class=\"rf-card__title\">What are you making?</h3>\n  <div class=\"rf-stack\" data-rf-tags data-rf-tags-name=\"topics\" data-rf-tags-max=\"5\">\n    <div class=\"rf-field\">\n      <label class=\"rf-label\" for=\"project-tag\">Project topics</label>\n      <div class=\"rf-input-action\"><input class=\"rf-input\" id=\"project-tag\" data-rf-tag-input maxlength=\"32\" placeholder=\"Add a topic…\" aria-describedby=\"tags-help\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-tag-add>Add tag</button></div>\n      <p class=\"rf-help\" id=\"tags-help\">Press Enter or Add tag. Choose up to five topics, 32 characters each.</p>\n    </div>\n    <ul class=\"rf-tag-list\" data-rf-tag-list aria-label=\"Selected topics\">\n      <li class=\"rf-tag\"><span>Design</span><input type=\"hidden\" name=\"topics\" value=\"Design\"></li>\n      <li class=\"rf-tag\"><span>Accessibility</span><input type=\"hidden\" name=\"topics\" value=\"Accessibility\"></li>\n    </ul>\n    <p class=\"rf-help\" role=\"status\"></p>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Preview topics</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Reset topics</button></div>\n</form>",
    "cssBytes": 20466
  },
  {
    "id": "data-table",
    "title": "Searchable table",
    "category": "Components",
    "description": "Find the right row, sort by name or number, and keep native table semantics.",
    "css": [
      "patterns",
      "table",
      "form",
      "button",
      "badge"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/data-table.html",
    "notes": [
      "Column buttons toggle ascending and descending order; aria-sort belongs to the active header.",
      "Set data-rf-sort to number for numeric columns. A cell may provide data-rf-sort-value for formatted values.",
      "Filters and sorting run on the current in-memory rows. Reinitialize after structural changes; use server queries for large or paginated datasets.",
      "The table remains readable without JavaScript. The scrollable region supports narrow screens.",
      "Accessibility reference: https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/"
    ],
    "html": "<section class=\"rf-stack\" data-rf-data-table aria-labelledby=\"work-table-title\">\n  <div class=\"rf-cluster\" style=\"justify-content:space-between\">\n    <div><p class=\"rf-eyebrow\">Less searching. More doing.</p><h3 id=\"work-table-title\" style=\"margin:0\">The work ahead.</h3></div>\n    <div class=\"rf-field\"><label class=\"rf-label\" for=\"work-search\">Find a project</label><input class=\"rf-input\" id=\"work-search\" type=\"search\" placeholder=\"Name, owner, or status…\" data-rf-table-search></div>\n  </div>\n  <div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Project list\">\n    <table class=\"rf-table\">\n      <caption>Sample projects. Use column buttons to sort; click again to reverse.</caption>\n      <thead><tr>\n        <th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"text\">Project <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th>\n        <th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"text\">Owner <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th>\n        <th scope=\"col\">Status</th>\n        <th scope=\"col\"><button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-sort=\"number\">Tasks <span aria-hidden=\"true\" data-rf-sort-icon>↕</span></button></th>\n      </tr></thead>\n      <tbody>\n        <tr><th scope=\"row\">Studio website</th><td>Robin</td><td><span class=\"rf-badge\" data-variant=\"success\">Published</span></td><td>12</td></tr>\n        <tr><th scope=\"row\">Mobile journal</th><td>Jamie</td><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>3</td></tr>\n        <tr><th scope=\"row\">Brand refresh</th><td>Alex</td><td><span class=\"rf-badge\">Draft</span></td><td>20</td></tr>\n        <tr><th scope=\"row\">Component library</th><td>Robin</td><td><span class=\"rf-badge\" data-variant=\"warning\">In progress</span></td><td>8</td></tr>\n      </tbody>\n    </table>\n  </div>\n  <p class=\"rf-help\" role=\"status\" data-rf-table-status>Four sample projects.</p>\n</section>",
    "cssBytes": 21034
  },
  {
    "id": "launch-checklist",
    "title": "Launch checklist",
    "category": "Components",
    "description": "Turn onboarding into a clear path with native checkboxes and honest progress.",
    "css": [
      "patterns",
      "form",
      "progress",
      "card",
      "button",
      "badge"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/launch-checklist.html",
    "notes": [
      "Checkbox state stays in the current page and is not persisted by the library.",
      "The native progress element and status update together. Reset restores the original checklist.",
      "Works with keyboard and touch; no motion is required to understand completion."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-rf-check-progress style=\"max-width:34rem\" method=\"dialog\">\n  <div class=\"rf-cluster\" style=\"justify-content:space-between\"><p class=\"rf-eyebrow\">Small steps. Something real.</p><span class=\"rf-badge\">Your launch plan</span></div>\n  <h3 class=\"rf-card__title\">Bring your idea into the world.</h3>\n  <label class=\"rf-help\" for=\"launch-progress\">Launch preparation</label>\n  <progress class=\"rf-progress\" id=\"launch-progress\" value=\"1\" max=\"3\">1 of 3 steps complete</progress>\n  <ul class=\"rf-launch-list\">\n    <li><label><input type=\"checkbox\" name=\"launch\" value=\"idea\" checked><span><strong>Give your idea a name</strong><small>A good beginning is a clear direction.</small></span></label></li>\n    <li><label><input type=\"checkbox\" name=\"launch\" value=\"build\"><span><strong>Make your first version</strong><small>Pick your components. Build one useful thing.</small></span></label></li>\n    <li><label><input type=\"checkbox\" name=\"launch\" value=\"share\"><span><strong>Share it with someone</strong><small>A little feedback goes a long way.</small></span></label></li>\n  </ul>\n  <p class=\"rf-help\" role=\"status\" data-rf-check-status>1 of 3 steps complete</p>\n  <button class=\"rf-button rf-button--ghost\" type=\"reset\">Reset checklist</button>\n</form>",
    "cssBytes": 21943
  },
  {
    "id": "billing-switch",
    "title": "Billing switch",
    "category": "Components",
    "description": "A monthly/yearly plan comparison that keeps rates and billing language together.",
    "css": [
      "patterns",
      "sections",
      "form",
      "card",
      "button",
      "badge"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/billing-switch.html",
    "notes": [
      "Prices are supplied as display strings in data-rf-monthly and data-rf-yearly. The component performs no currency conversion or calculations.",
      "Yearly examples show a monthly equivalent with the annual amount stated below. Replace all figures and policies with your own.",
      "Native radios control the enhanced comparison. This is a pricing interface, not a checkout or subscription backend."
    ],
    "html": "<section class=\"rf-stack\" data-rf-billing data-demo-navigation aria-labelledby=\"billing-title\">\n  <div><p class=\"rf-eyebrow\">A clear choice, at your pace.</p><h3 id=\"billing-title\">A little room to grow.</h3><p class=\"rf-muted\">Illustrative plans for a fictional workspace.</p></div>\n  <fieldset class=\"rf-segmented\"><legend>Billing interval</legend><label><input type=\"radio\" name=\"example-billing\" value=\"monthly\" checked><span>Monthly</span></label><label><input type=\"radio\" name=\"example-billing\" value=\"yearly\"><span>Yearly · save 20%</span></label></fieldset>\n  <div class=\"rf-grid\">\n    <article class=\"rf-card rf-stack\"><h4 class=\"rf-card__title\">Personal</h4><p class=\"rf-muted\">A home for your own ideas.</p><p class=\"rf-price\"><span data-rf-monthly=\"$10\" data-rf-yearly=\"$8\">$10</span></p><p class=\"rf-help\" data-rf-billing-note>per month, billed monthly</p><a class=\"rf-button rf-button--outline\" href=\"../examples/dashboard.html?workspace=personal#billing\">Choose Personal</a></article>\n    <article class=\"rf-card rf-stack rf-pricing__featured\"><span class=\"rf-badge\" data-variant=\"success\">For building together</span><h4 class=\"rf-card__title\">Studio</h4><p class=\"rf-muted\">More space for your next chapter.</p><p class=\"rf-price\"><span data-rf-monthly=\"$25\" data-rf-yearly=\"$20\">$25</span></p><p class=\"rf-help\" data-rf-billing-note>per month, billed monthly</p><a class=\"rf-button\" href=\"../examples/dashboard.html?workspace=studio#billing\">Choose Studio</a></article>\n  </div>\n  <p class=\"rf-help\">A pricing interface demo. No payment is collected. Yearly examples represent $96 and $240 per year.</p>\n</section>",
    "cssBytes": 25276
  },
  {
    "id": "dot-grid",
    "title": "Dot grid",
    "category": "Effects",
    "description": "A repeating background drawn entirely in CSS.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/dot-grid.html",
    "notes": [
      "Decorative background only. Keep text contrast readable over it."
    ],
    "html": "<div class=\"rf-card rf-dot-grid rf-center\" style=\"padding:3rem\"><h3>Small details. Big character.</h3><p class=\"rf-muted\">A little texture, without an image.</p></div>",
    "cssBytes": 6409
  },
  {
    "id": "gradient-text",
    "title": "Gradient text",
    "category": "Effects",
    "description": "A restrained two-color treatment for a headline.",
    "css": [
      "effects"
    ],
    "js": [],
    "file": "examples/components/gradient-text.html",
    "notes": [
      "Use sparingly and check contrast across the full gradient.",
      "Forced-color mode falls back to normal text."
    ],
    "html": "<h2 class=\"rf-gradient-text\" style=\"font-size:clamp(2rem,6vw,3.5rem); margin:0; line-height:1.1; letter-spacing:-.05em\">Make something<br>worth opening.</h2>",
    "cssBytes": 5516
  },
  {
    "id": "hover-lift",
    "title": "Hover lift",
    "category": "Effects",
    "description": "A small lift for interactive cards, with reduced-motion support.",
    "css": [
      "effects",
      "card",
      "button"
    ],
    "js": [],
    "file": "examples/components/hover-lift.html",
    "notes": [
      "Hover styling is decorative. Put a real interactive control inside the card.",
      "Reduced-motion mode disables movement."
    ],
    "html": "<article class=\"rf-card rf-hover-lift\"><h3 class=\"rf-card__title\">A little elevation.</h3><p class=\"rf-card__description\">Hover over this card to see it move.</p><div class=\"rf-card__footer\"><button class=\"rf-button rf-button--outline\" type=\"button\">Explore</button></div></article>",
    "cssBytes": 8033
  },
  {
    "id": "spotlight",
    "title": "Spotlight",
    "category": "Effects",
    "description": "A subtle pointer-following highlight, updated once per animation frame.",
    "css": [
      "effects",
      "card"
    ],
    "js": [
      "effects"
    ],
    "file": "examples/components/spotlight.html",
    "notes": [
      "Opt-in: import initEffects from the separate effects module.",
      "No pointer tracking on touch devices or in reduced-motion mode.",
      "The card stays usable without JavaScript."
    ],
    "html": "<article class=\"rf-card\" data-rf-spotlight style=\"padding:3rem\"><h3 class=\"rf-card__title\">Follow your curiosity.</h3><p class=\"rf-card__description\">Move your pointer across this surface.</p></article>",
    "cssBytes": 6409
  },
  {
    "id": "reveal",
    "title": "Reveal",
    "category": "Effects",
    "description": "A one-time entrance as content comes into view.",
    "css": [
      "effects",
      "card"
    ],
    "js": [
      "effects"
    ],
    "file": "examples/components/reveal.html",
    "notes": [
      "Content is visible without JS.",
      "IntersectionObserver reveals each element once. Reduced-motion mode shows content immediately.",
      "Call initEffects for each new subtree and its returned teardown before removing it."
    ],
    "html": "<div class=\"rf-grid\" style=\"--rf-column:10rem\"><article class=\"rf-card\" data-rf-reveal>Start small.</article><article class=\"rf-card\" data-rf-reveal>Build thoughtfully.</article><article class=\"rf-card\" data-rf-reveal>Keep it light.</article></div>",
    "cssBytes": 6409
  },
  {
    "id": "shimmer",
    "title": "Shimmer",
    "category": "Effects",
    "description": "A single sheen on hover or focus, not a continuous animation.",
    "css": [
      "effects",
      "button"
    ],
    "js": [],
    "file": "examples/components/shimmer.html",
    "notes": [
      "Runs only on interaction. Reduced-motion mode disables the effect."
    ],
    "html": "<button class=\"rf-button rf-button--large rf-shimmer\" type=\"button\">Make your next move <span aria-hidden=\"true\">→</span></button>",
    "cssBytes": 7140
  },
  {
    "id": "hero",
    "title": "Split hero",
    "category": "Sections",
    "description": "An introduction with a clear promise and a small product preview.",
    "css": [
      "sections",
      "card",
      "button",
      "badge",
      "progress"
    ],
    "js": [],
    "file": "sections/hero.html",
    "notes": [
      "Replace placeholder copy and links with your product’s real content.",
      "Include the core stylesheet and the optional sections stylesheet."
    ],
    "html": "<section class=\"rf-section rf-container rf-hero\">\n  <div><span class=\"rf-badge\">A quieter way to build</span><h1>Less overhead.<br>More possibility.</h1><p class=\"rf-section__intro\">A thoughtful workspace for your ideas, your team, and the work that matters.</p><div class=\"rf-cluster\"><a class=\"rf-button\" href=\"#get-started\">Start building</a><a class=\"rf-button rf-button--outline\" href=\"#features\">See how it works</a></div></div>\n  <div class=\"rf-hero__visual\"><article class=\"rf-card\"><span class=\"rf-eyebrow\">Your next chapter</span><h2 class=\"rf-card__title\" style=\"margin-top:1rem\">Website launch</h2><p class=\"rf-card__description\">A little progress, every day.</p><div style=\"margin-top:1.5rem\"><label class=\"rf-help\" for=\"hero-progress\">72% complete</label><progress class=\"rf-progress\" id=\"hero-progress\" max=\"100\" value=\"72\">72%</progress></div></article></div>\n</section>",
    "cssBytes": 8006
  },
  {
    "id": "features",
    "title": "Feature grid",
    "category": "Sections",
    "description": "Three simple benefits with room for real explanations.",
    "css": [
      "sections",
      "card"
    ],
    "js": [],
    "file": "sections/features.html",
    "notes": [
      "This responsive layout uses the shared rf-grid utility."
    ],
    "html": "<section class=\"rf-section rf-container\" id=\"features\"><p class=\"rf-eyebrow\">The essentials, considered</p><h2 class=\"rf-section__heading\">Everything you need.<br>Space for what’s next.</h2><p class=\"rf-section__intro\">A foundation that gets out of your way.</p><div class=\"rf-grid\"><article class=\"rf-card\"><h3 class=\"rf-card__title\">Start with HTML</h3><p class=\"rf-card__description\">Use familiar elements and keep your content readable from the first response.</p></article><article class=\"rf-card\"><h3 class=\"rf-card__title\">Make it yours</h3><p class=\"rf-card__description\">Change a few design tokens to bring your own colors, spacing, and character.</p></article><article class=\"rf-card\"><h3 class=\"rf-card__title\">Load what you use</h3><p class=\"rf-card__description\">Pick individual components and keep optional effects separate.</p></article></div></section>",
    "cssBytes": 4905
  },
  {
    "id": "bento",
    "title": "Bento grid",
    "category": "Sections",
    "description": "An asymmetric feature layout that becomes a stack on small screens.",
    "css": [
      "sections",
      "card",
      "badge",
      "progress"
    ],
    "js": [],
    "file": "sections/bento.html",
    "notes": [
      "The first item spans two columns on larger screens.",
      "The reading order stays the same as the DOM order."
    ],
    "html": "<section class=\"rf-section rf-container\"><p class=\"rf-eyebrow\">Built for real work</p><h2 class=\"rf-section__heading\">Small pieces.<br>Good things together.</h2><div class=\"rf-bento\"><article class=\"rf-card\"><span class=\"rf-badge\" data-variant=\"success\">In your flow</span><h3>One place for the whole picture.</h3><p class=\"rf-muted\">Bring your projects, plans, and people into a workspace that feels natural.</p></article><article class=\"rf-card\"><p class=\"rf-eyebrow\">Momentum</p><p class=\"rf-stat\">72%</p><label class=\"rf-help\" for=\"bento-progress\">Project complete</label><progress class=\"rf-progress\" id=\"bento-progress\" max=\"100\" value=\"72\">72%</progress></article><article class=\"rf-card\"><h3>Made to adapt.</h3><p class=\"rf-muted\">A responsive foundation, from pocket to desktop.</p></article><article class=\"rf-card\"><h3>Your own character.</h3><p class=\"rf-muted\">Bring your colors and your perspective.</p></article><article class=\"rf-card\"><h3>Room to grow.</h3><p class=\"rf-muted\">Start with one component. Compose something larger.</p></article></div></section>",
    "cssBytes": 6382
  },
  {
    "id": "pricing",
    "title": "Pricing",
    "category": "Sections",
    "description": "Three transparent plans, with one clearly highlighted.",
    "css": [
      "sections",
      "card",
      "button",
      "badge"
    ],
    "js": [],
    "file": "sections/pricing.html",
    "notes": [
      "Prices and features are sample content. Replace them before publishing.",
      "Use real purchase or contact destinations. This section does not process payments."
    ],
    "html": "<section class=\"rf-section rf-container rf-pricing\"><p class=\"rf-eyebrow\">Simple plans</p><h2 class=\"rf-section__heading\">A good fit, at every stage.</h2><p class=\"rf-section__intro\">Illustrative plans for your own product. Rofin UI itself is free and MIT licensed.</p><div class=\"rf-grid\"><article class=\"rf-card\"><h3 class=\"rf-card__title\">Personal</h3><p class=\"rf-muted\">A place to begin.</p><p class=\"rf-price\">$0 <small>/ month</small></p><ul><li>One workspace</li><li>Personal projects</li><li>Community support</li></ul><a class=\"rf-button rf-button--outline\" href=\"#get-started\">Start free</a></article><article class=\"rf-card rf-pricing__featured\"><span class=\"rf-badge\">For growing teams</span><h3 style=\"margin-bottom:0\">Studio</h3><p class=\"rf-muted\">Space to build together.</p><p class=\"rf-price\">$19 <small>/ month</small></p><ul><li>Unlimited projects</li><li>Team collaboration</li><li>Priority support</li></ul><a class=\"rf-button\" href=\"#get-started\">Choose Studio</a></article><article class=\"rf-card\"><h3 class=\"rf-card__title\">Organization</h3><p class=\"rf-muted\">Room for the bigger picture.</p><p class=\"rf-price\">Let’s talk</p><ul><li>Multiple workspaces</li><li>Custom onboarding</li><li>Dedicated support</li></ul><a class=\"rf-button rf-button--outline\" href=\"#contact\">Contact us</a></article></div></section>",
    "cssBytes": 7327
  },
  {
    "id": "testimonials",
    "title": "Testimonials",
    "category": "Sections",
    "description": "A compact quote layout with clear attribution.",
    "css": [
      "sections",
      "card",
      "avatar"
    ],
    "js": [],
    "file": "sections/testimonials.html",
    "notes": [
      "These are fictional demonstration quotes, not endorsements.",
      "Use figure, blockquote, and figcaption for quote attribution."
    ],
    "html": "<section class=\"rf-section rf-container\"><p class=\"rf-eyebrow\">A few kind words</p><h2 class=\"rf-section__heading\">Good work feels lighter.</h2><p class=\"rf-section__intro\">Sample testimonials for layout demonstration. Replace these with permissioned customer quotes.</p><div class=\"rf-grid\"><figure class=\"rf-card rf-testimonial\" style=\"margin:0\"><blockquote>“The right foundation makes room for the work that matters.”</blockquote><figcaption><span class=\"rf-avatar\" aria-hidden=\"true\">AM</span><div><strong>Alex Morgan</strong><br><span class=\"rf-muted\">Sample designer</span></div></figcaption></figure><figure class=\"rf-card rf-testimonial\" style=\"margin:0\"><blockquote>“Small, thoughtful pieces that come together beautifully.”</blockquote><figcaption><span class=\"rf-avatar\" aria-hidden=\"true\">JL</span><div><strong>Jamie Lee</strong><br><span class=\"rf-muted\">Sample developer</span></div></figcaption></figure></div></section>",
    "cssBytes": 5466
  },
  {
    "id": "stats",
    "title": "Stats",
    "category": "Sections",
    "description": "A tidy row of numbers with the context to make them useful.",
    "css": [
      "sections",
      "card"
    ],
    "js": [],
    "file": "sections/stats.html",
    "notes": [
      "Numbers are sample workspace data, not measured Rofin performance claims."
    ],
    "html": "<section class=\"rf-section rf-container\" aria-label=\"Sample workspace statistics\"><p class=\"rf-eyebrow\">A little perspective</p><h2 class=\"rf-section__heading\">Your workspace, in numbers.</h2><div class=\"rf-grid\"><article class=\"rf-card\"><p class=\"rf-stat\">24</p><p class=\"rf-muted\">Active projects</p></article><article class=\"rf-card\"><p class=\"rf-stat\">8</p><p class=\"rf-muted\">Teammates</p></article><article class=\"rf-card\"><p class=\"rf-stat\">72%</p><p class=\"rf-muted\">Current milestone</p></article></div></section>",
    "cssBytes": 4905
  },
  {
    "id": "faq",
    "title": "FAQ",
    "category": "Sections",
    "description": "A complete frequently asked questions section without JavaScript.",
    "css": [
      "sections",
      "accordion"
    ],
    "js": [],
    "file": "sections/faq.html",
    "notes": [
      "Built entirely from the native accordion and section styles."
    ],
    "html": "<section class=\"rf-section rf-container\"><p class=\"rf-eyebrow\">A few answers</p><h2 class=\"rf-section__heading\">Wondering about something?</h2><div class=\"rf-accordion\"><details><summary>Can I use this commercially?</summary><div class=\"rf-accordion__content\"><p>Yes. Rofin UI is MIT licensed. Retain the license and copyright notice when redistributing the code.</p></div></details><details><summary>Does it work with my stack?</summary><div class=\"rf-accordion__content\"><p>The foundation is HTML, CSS, and vanilla JavaScript. No framework is required.</p></div></details><details><summary>Can I pick just one component?</summary><div class=\"rf-accordion__content\"><p>Yes. Load the design tokens and the individual component styles or behavior you need.</p></div></details></div></section>",
    "cssBytes": 4722
  },
  {
    "id": "cta",
    "title": "Call to action",
    "category": "Sections",
    "description": "One promise and one clear next step.",
    "css": [
      "sections",
      "card",
      "button"
    ],
    "js": [],
    "file": "sections/cta.html",
    "notes": [
      "Connect the link to your product’s actual signup or contact destination."
    ],
    "html": "<section class=\"rf-section rf-container\" id=\"get-started\"><div class=\"rf-card rf-center\" style=\"padding:3rem 1.5rem\"><p class=\"rf-eyebrow\">Your next chapter</p><h2 class=\"rf-section__heading\" style=\"margin-inline:auto\">Make room for a good idea.</h2><p class=\"rf-section__intro\" style=\"margin-inline:auto\">Start small. Build something that feels like you.</p><a class=\"rf-button rf-button--large\" href=\"#contact\">Let’s get started <span aria-hidden=\"true\">→</span></a></div></section>",
    "cssBytes": 6529
  },
  {
    "id": "footer",
    "title": "Footer",
    "category": "Sections",
    "description": "A compact footer with a brand, useful links, and a copyright line.",
    "css": [
      "sections",
      "navigation"
    ],
    "js": [],
    "file": "sections/footer.html",
    "notes": [
      "Replace the brand, year, and links with your own content."
    ],
    "html": "<footer class=\"rf-footer rf-container\"><div><strong>Studio</strong><p style=\"margin:.25rem 0\">© 2026 Your company</p></div><nav class=\"rf-nav\" aria-label=\"Footer links\"><a href=\"#about\">About</a><a href=\"#privacy\">Privacy</a><a href=\"#contact\">Contact</a></nav></footer>",
    "cssBytes": 4627
  },
  {
    "id": "contact",
    "title": "Contact form",
    "category": "Sections",
    "description": "A labelled native form layout, ready for your submission handler.",
    "css": [
      "sections",
      "card",
      "form",
      "button"
    ],
    "js": [],
    "file": "sections/contact.html",
    "notes": [
      "The gallery intercepts submissions and sends no data.",
      "Replace data-demo-form with your own action, method, and handler.",
      "Validate all submitted data on the server."
    ],
    "html": "<section class=\"rf-section rf-container\" id=\"contact\"><div class=\"rf-grid\"><div><p class=\"rf-eyebrow\">Start a conversation</p><h2 class=\"rf-section__heading\">Tell us what’s next.</h2><p class=\"rf-section__intro\">A sample form layout. Connect it to your own backend before publishing.</p></div><form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\"><div class=\"rf-field\"><label class=\"rf-label\" for=\"contact-name\">Name</label><input class=\"rf-input\" id=\"contact-name\" name=\"name\" autocomplete=\"name\" required></div><div class=\"rf-field\"><label class=\"rf-label\" for=\"contact-email\">Email</label><input class=\"rf-input\" id=\"contact-email\" type=\"email\" name=\"email\" autocomplete=\"email\" required></div><div class=\"rf-field\"><label class=\"rf-label\" for=\"contact-message\">Message</label><textarea class=\"rf-textarea\" id=\"contact-message\" name=\"message\" required></textarea></div><button class=\"rf-button\" type=\"submit\">Send message</button></form></div></section>",
    "cssBytes": 9622
  },
  {
    "id": "image-compare",
    "title": "Image comparison",
    "category": "Components",
    "description": "Slide between two versions with a keyboard-accessible native range.",
    "css": [
      "patterns",
      "form"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/image-compare.html",
    "notes": [
      "Replace the two panels with your own images and useful alt text. Both images stay visible side by side at the initial split without JavaScript.",
      "The native range supports arrows, Home/End, touch, and keyboard."
    ],
    "html": "<div data-rf-compare class=\"rf-stack\">\n  <div class=\"rf-compare\" role=\"img\" aria-label=\"Before and after design comparison\">\n    <div class=\"rf-compare__before\">\n      <strong style=\"font-size:clamp(1.5rem,5vw,3rem)\">\n        An idea.\n        <br>\n        A blank canvas.\n      </strong>\n    </div>\n    <div class=\"rf-compare__after\">\n      <strong style=\"font-size:clamp(1.5rem,5vw,3rem)\">\n        An idea.\n        <br>\n        Brought to life.\n      </strong>\n    </div>\n    <span class=\"rf-compare__label\">\n      Before\n    </span>\n    <span class=\"rf-compare__label rf-compare__label--after\">\n      After\n    </span>\n  </div>\n  <label class=\"rf-field\">\n    <span class=\"rf-label\">\n      Comparison position\n    </span>\n    <input class=\"rf-range\" type=\"range\" min=\"0\" max=\"100\" value=\"50\">\n  </label>\n</div>",
    "cssBytes": 17949
  },
  {
    "id": "carousel",
    "title": "Scroll-snap carousel",
    "category": "Components",
    "description": "Swipe, scroll, or use buttons to browse a native horizontal rail.",
    "css": [
      "patterns",
      "card",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/carousel.html",
    "notes": [
      "Scrolling and CSS snapping work without JavaScript. Optional buttons scroll one card at a time.",
      "No autoplay or hidden slides. Respects reduced motion and right-to-left direction."
    ],
    "html": "<section data-rf-carousel aria-label=\"Project ideas\">\n  <div class=\"rf-carousel__track\" tabindex=\"0\" aria-label=\"Scrollable project cards\">\n    <article class=\"rf-card\">\n      <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n        01\n      </div>\n      <h3>\n        Start somewhere\n      </h3>\n      <p class=\"rf-muted\">\n        A small sketch becomes a real direction.\n      </p>\n    </article>\n    <article class=\"rf-card\">\n      <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n        02\n      </div>\n      <h3>\n        Find your rhythm\n      </h3>\n      <p class=\"rf-muted\">\n        Make space for the work that matters.\n      </p>\n    </article>\n    <article class=\"rf-card\">\n      <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n        03\n      </div>\n      <h3>\n        Keep going\n      </h3>\n      <p class=\"rf-muted\">\n        Build the next chapter, one piece at a time.\n      </p>\n    </article>\n  </div>\n  <div class=\"rf-carousel__controls\">\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-carousel-move=\"-1\" aria-label=\"Previous cards\">\n      ← Previous\n    </button>\n    <span class=\"rf-help\">\n      3 project ideas\n    </span>\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-carousel-move=\"1\" aria-label=\"Next cards\">\n      Next →\n    </button>\n  </div>\n</section>",
    "cssBytes": 17373
  },
  {
    "id": "command-palette",
    "title": "Command palette",
    "category": "Components",
    "description": "A searchable command list inside a native modal.",
    "css": [
      "patterns",
      "dialog",
      "button",
      "form"
    ],
    "js": [
      "dialog",
      "patterns"
    ],
    "file": "examples/components/command-palette.html",
    "notes": [
      "Uses native dialog focus management. Arrow keys browse the filtered list; Enter selects.",
      "Listen for rf:command; detail.value contains the chosen command. Connect that event to application behavior.",
      "The preview reports the choice locally and performs no application action."
    ],
    "html": "<button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-dialog-open=\"example-command\">\n  Open commands\n  <kbd>\n    ↓\n  </kbd>\n</button>\n<dialog class=\"rf-dialog rf-command\" id=\"example-command\" aria-labelledby=\"command-title\" data-rf-command>\n  <div class=\"rf-cluster\" style=\"justify-content:space-between\">\n    <h2 id=\"command-title\">\n      What would you like to do?\n    </h2>\n    <button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-dialog-close aria-label=\"Close commands\">\n      ×\n    </button>\n  </div>\n  <label class=\"rf-field\">\n    <span class=\"rf-label\">\n      Search commands\n    </span>\n    <input class=\"rf-input\" type=\"search\" placeholder=\"Try settings…\" autofocus>\n  </label>\n  <div class=\"rf-command__list\">\n    <button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-command-item=\"new-project\">\n      Create project\n      <span aria-hidden=\"true\">\n        ↗\n      </span>\n    </button>\n    <button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-command-item=\"settings\">\n      Open settings\n      <span aria-hidden=\"true\">\n        ↗\n      </span>\n    </button>\n    <button class=\"rf-button rf-button--ghost\" type=\"button\" data-rf-command-item=\"help\">\n      Get help\n      <span aria-hidden=\"true\">\n        ↗\n      </span>\n    </button>\n  </div>\n  <p class=\"rf-help\" role=\"status\">\n  </p>\n  <p class=\"rf-help\">\n    Arrow keys to browse. Enter to choose. Escape to close.\n  </p>\n</dialog>",
    "cssBytes": 20385
  },
  {
    "id": "like-button",
    "title": "Like button",
    "category": "Components",
    "description": "A reversible pressed state with an optional local count.",
    "css": [
      "button",
      "patterns"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/like-button.html",
    "notes": [
      "aria-pressed communicates the toggle state. The label remains stable.",
      "Counts are demo data in memory. Your app owns persistence and authorization."
    ],
    "html": "<button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-like aria-pressed=\"false\">\n  <span aria-hidden=\"true\">\n    ♡\n  </span>\n  Like\n  <span data-rf-like-count>\n    128\n  </span>\n</button>",
    "cssBytes": 16480
  },
  {
    "id": "number-stepper",
    "title": "Number stepper",
    "category": "Components",
    "description": "Native number validation, with convenient plus and minus buttons.",
    "css": [
      "patterns",
      "form",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/number-stepper.html",
    "notes": [
      "Uses native stepUp/stepDown, min, max, and step. The number input stays usable without JavaScript.",
      "Emits ordinary input and change events. Disabled and read-only inputs are not changed."
    ],
    "html": "<div class=\"rf-stack\">\n  <label class=\"rf-label\" for=\"quantity\">\n    Quantity\n  </label>\n  <div class=\"rf-stepper\" data-rf-stepper>\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-stepper-move=\"-1\" aria-label=\"Decrease quantity\">\n      −\n    </button>\n    <input class=\"rf-input\" id=\"quantity\" type=\"number\" min=\"1\" max=\"10\" step=\"1\" value=\"2\">\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-stepper-move=\"1\" aria-label=\"Increase quantity\">\n      +\n    </button>\n  </div>\n  <p class=\"rf-help\">\n    Between 1 and 10. You can also type a quantity.\n  </p>\n</div>",
    "cssBytes": 19573
  },
  {
    "id": "segmented-control",
    "title": "Segmented control",
    "category": "Components",
    "description": "A pill selector powered by a native radio group.",
    "css": [
      "patterns"
    ],
    "js": [],
    "file": "examples/components/segmented-control.html",
    "notes": [
      "A native radio group supports arrow keys and form submission. No JavaScript is needed."
    ],
    "html": "<fieldset class=\"rf-segmented\">\n  <legend>\n    View density\n  </legend>\n  <label>\n    <input type=\"radio\" name=\"density\" value=\"comfortable\" checked>\n    <span>\n      Comfortable\n    </span>\n  </label>\n  <label>\n    <input type=\"radio\" name=\"density\" value=\"compact\" >\n    <span>\n      Compact\n    </span>\n  </label>\n  <label>\n    <input type=\"radio\" name=\"density\" value=\"minimal\" >\n    <span>\n      Minimal\n    </span>\n  </label>\n</fieldset>",
    "cssBytes": 14856
  },
  {
    "id": "date-picker",
    "title": "Date picker",
    "category": "Components",
    "description": "A styled native date field, with browser-owned calendar and validation.",
    "css": [
      "form"
    ],
    "js": [],
    "file": "examples/components/date-picker.html",
    "notes": [
      "Native browser calendar, locale, touch behavior, and validation are retained.",
      "Use min/max for date limits. Validate submitted dates on the server."
    ],
    "html": "<label class=\"rf-field\">\n  <span class=\"rf-label\">\n    Project start date\n  </span>\n  <input class=\"rf-input\" type=\"date\" name=\"start-date\">\n  <span class=\"rf-help\">\n    Calendar appearance follows your browser and device.\n  </span>\n</label>",
    "cssBytes": 3093
  },
  {
    "id": "one-time-code",
    "title": "One-time code",
    "category": "Components",
    "description": "One labelled field with paste, autofill, and native six-digit validation.",
    "css": [
      "form",
      "button"
    ],
    "js": [],
    "file": "examples/components/one-time-code.html",
    "notes": [
      "One input avoids fragmented paste and screen-reader navigation. Leading zeroes are retained.",
      "Your server must check expiry, attempt limits, and validity. This component does not authenticate."
    ],
    "html": "<form class=\"rf-stack\" data-demo-form method=\"dialog\">\n  <label class=\"rf-field\">\n    <span class=\"rf-label\">\n      Verification code\n    </span>\n    <input class=\"rf-input\" name=\"code\" type=\"text\" inputmode=\"numeric\" autocomplete=\"one-time-code\" pattern=\"[0-9]{6}\" maxlength=\"6\" required placeholder=\"123456\" aria-describedby=\"code-help\">\n    <span id=\"code-help\" class=\"rf-help\">\n      Enter the six-digit code. Demo only; no verification request is sent.\n    </span>\n  </label>\n  <button class=\"rf-button\" type=\"submit\">\n    Verify code\n  </button>\n</form>",
    "cssBytes": 4717
  },
  {
    "id": "timeline",
    "title": "Timeline",
    "category": "Components",
    "description": "A readable sequence with real dates and a quiet connecting line.",
    "css": [
      "patterns"
    ],
    "js": [],
    "file": "examples/components/timeline.html",
    "notes": [
      "DOM order remains the reading order. Dates are sample content."
    ],
    "html": "<ol class=\"rf-timeline\">\n  <li>\n    <time datetime=\"2026-10-01\">\n      October 1, 2026\n    </time>\n    <h3>\n      The first sketch\n    </h3>\n    <p class=\"rf-muted\">\n      Find a direction worth exploring.\n    </p>\n  </li>\n  <li>\n    <time datetime=\"2026-10-02\">\n      October 2, 2026\n    </time>\n    <h3>\n      Build together\n    </h3>\n    <p class=\"rf-muted\">\n      Turn the idea into something useful.\n    </p>\n  </li>\n  <li>\n    <time datetime=\"2026-10-03\">\n      October 3, 2026\n    </time>\n    <h3>\n      Ready to share\n    </h3>\n    <p class=\"rf-muted\">\n      Check the details, then open the doors.\n    </p>\n  </li>\n</ol>",
    "cssBytes": 14856
  },
  {
    "id": "dock",
    "title": "Floating dock",
    "category": "Components",
    "description": "A compact set of real navigation links, with hover and focus feedback.",
    "css": [
      "patterns"
    ],
    "js": [],
    "file": "examples/components/dock.html",
    "notes": [
      "Replace fragment destinations with your real routes. Labels are always visible.",
      "CSS handles focus and hover. Movement is disabled for reduced motion. Position the dock in your app as needed."
    ],
    "html": "<nav class=\"rf-dock\" aria-label=\"Workspace shortcuts\">\n  <a href=\"#projects\">\n    Projects\n  </a>\n  <a href=\"#activity\">\n    Activity\n  </a>\n  <a href=\"#team\">\n    Team\n  </a>\n  <a href=\"#settings\">\n    Settings\n  </a>\n</nav>",
    "cssBytes": 14856
  },
  {
    "id": "expandable-card",
    "title": "Expandable card",
    "category": "Components",
    "description": "A content card that opens with native details.",
    "css": [
      "patterns",
      "card",
      "button"
    ],
    "js": [],
    "file": "examples/components/expandable-card.html",
    "notes": [
      "Native details supports keyboard toggling and stays useful without JavaScript.",
      "Place links and buttons in the expanded content, outside summary."
    ],
    "html": "<details class=\"rf-card rf-expandable\">\n  <summary>\n    A little more about this project\n  </summary>\n  <div class=\"rf-expandable__content\">\n    <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n      ↗\n    </div>\n    <h3>\n      Make room for your next idea.\n    </h3>\n    <p>\n      Start with the simplest version that helps someone. Keep refining it together.\n    </p>\n    <a class=\"rf-button rf-button--outline\" href=\"#project\">\n      Open project\n    </a>\n  </div>\n</details>",
    "cssBytes": 17373
  },
  {
    "id": "image-accordion",
    "title": "Image accordion",
    "category": "Components",
    "description": "An expanding content rail using native details, without hover-only access.",
    "css": [
      "patterns"
    ],
    "js": [],
    "file": "examples/components/image-accordion.html",
    "notes": [
      "Replace decorative art with your own images. Multiple panels may remain open.",
      "Keyboard and touch users can expand each panel. Content remains accessible without hover or JavaScript."
    ],
    "html": "<div class=\"rf-image-accordion\">\n  <details open>\n    <summary>\n      Explore\n    </summary>\n    <div style=\"padding:0 1rem\">\n      <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n        ○\n      </div>\n    </div>\n    <p>\n      Find a fresh perspective.\n    </p>\n  </details>\n  <details >\n    <summary>\n      Create\n    </summary>\n    <div style=\"padding:0 1rem\">\n      <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n        △\n      </div>\n    </div>\n    <p>\n      Give your idea a shape.\n    </p>\n  </details>\n  <details >\n    <summary>\n      Share\n    </summary>\n    <div style=\"padding:0 1rem\">\n      <div class=\"rf-pattern-art\" aria-hidden=\"true\">\n        □\n      </div>\n    </div>\n    <p>\n      Make something useful together.\n    </p>\n  </details>\n</div>",
    "cssBytes": 14856
  },
  {
    "id": "card-stack",
    "title": "Card stack",
    "category": "Components",
    "description": "Layered decorative depth around one readable content card.",
    "css": [
      "patterns",
      "card",
      "button"
    ],
    "js": [],
    "file": "examples/components/card-stack.html",
    "notes": [
      "The backing layers are decorative CSS. One real card remains in the accessibility tree.",
      "This is a static stack, not a swipe deck or auto-rotating carousel."
    ],
    "html": "<div class=\"rf-card-stack\">\n  <article class=\"rf-card\">\n    <p class=\"rf-eyebrow\">\n      Next in your collection\n    </p>\n    <h3>\n      Small details. Lasting impressions.\n    </h3>\n    <p class=\"rf-muted\">\n      A layered surface for a project, testimonial, or next step.\n    </p>\n    <a class=\"rf-button\" href=\"#collection\">\n      Explore collection →\n    </a>\n  </article>\n</div>",
    "cssBytes": 17373
  },
  {
    "id": "checklist",
    "title": "Checklist",
    "category": "Components",
    "description": "Real checkboxes for a clear, satisfying sequence of tasks.",
    "css": [
      "patterns",
      "form"
    ],
    "js": [],
    "file": "examples/components/checklist.html",
    "notes": [
      "Native checkbox state and submission. Persistence belongs to your application.",
      "The checked treatment retains the task label and text contrast."
    ],
    "html": "<ul class=\"rf-checklist\">\n  <li>\n    <label class=\"rf-check\">\n      <input type=\"checkbox\" name=\"tasks\" value=\"0\" checked>\n      <span>\n        Sketch the first idea\n      </span>\n    </label>\n  </li>\n  <li>\n    <label class=\"rf-check\">\n      <input type=\"checkbox\" name=\"tasks\" value=\"1\" >\n      <span>\n        Build a small prototype\n      </span>\n    </label>\n  </li>\n  <li>\n    <label class=\"rf-check\">\n      <input type=\"checkbox\" name=\"tasks\" value=\"2\" >\n      <span>\n        Check the keyboard flow\n      </span>\n    </label>\n  </li>\n  <li>\n    <label class=\"rf-check\">\n      <input type=\"checkbox\" name=\"tasks\" value=\"3\" >\n      <span>\n        Share it with someone\n      </span>\n    </label>\n  </li>\n</ul>",
    "cssBytes": 17949
  },
  {
    "id": "rating",
    "title": "Rating",
    "category": "Components",
    "description": "A five-choice rating with visible numbers and native radio semantics.",
    "css": [
      "patterns"
    ],
    "js": [],
    "file": "examples/components/rating.html",
    "notes": [
      "Arrow keys move between values. Numeric labels communicate meaning without relying on star color."
    ],
    "html": "<fieldset class=\"rf-rating\">\n  <legend>\n    How was your experience?\n  </legend>\n  <label>\n    <input type=\"radio\" name=\"rating\" value=\"1\" aria-label=\"1 out of 5\">\n    <span>\n      <span aria-hidden=\"true\">\n        ☆\n      </span>\n      1\n    </span>\n  </label>\n  <label>\n    <input type=\"radio\" name=\"rating\" value=\"2\" aria-label=\"2 out of 5\">\n    <span>\n      <span aria-hidden=\"true\">\n        ☆\n      </span>\n      2\n    </span>\n  </label>\n  <label>\n    <input type=\"radio\" name=\"rating\" value=\"3\" aria-label=\"3 out of 5\">\n    <span>\n      <span aria-hidden=\"true\">\n        ☆\n      </span>\n      3\n    </span>\n  </label>\n  <label>\n    <input type=\"radio\" name=\"rating\" value=\"4\" aria-label=\"4 out of 5\">\n    <span>\n      <span aria-hidden=\"true\">\n        ☆\n      </span>\n      4\n    </span>\n  </label>\n  <label>\n    <input type=\"radio\" name=\"rating\" value=\"5\" aria-label=\"5 out of 5\">\n    <span>\n      <span aria-hidden=\"true\">\n        ☆\n      </span>\n      5\n    </span>\n  </label>\n</fieldset>",
    "cssBytes": 14856
  },
  {
    "id": "interest-picker",
    "title": "Interest picker",
    "category": "Components",
    "description": "A wrapping set of selectable chips using native checkboxes.",
    "css": [
      "patterns"
    ],
    "js": [],
    "file": "examples/components/interest-picker.html",
    "notes": [
      "Each chip is a labelled checkbox. Works with keyboard, touch, and forms without JavaScript."
    ],
    "html": "<fieldset class=\"rf-chips\">\n  <legend>\n    What would you like to explore?\n  </legend>\n  <label>\n    <input type=\"checkbox\" name=\"interests\" value=\"design\" checked>\n    <span>\n      Design\n    </span>\n  </label>\n  <label>\n    <input type=\"checkbox\" name=\"interests\" value=\"engineering\" >\n    <span>\n      Engineering\n    </span>\n  </label>\n  <label>\n    <input type=\"checkbox\" name=\"interests\" value=\"motion\" >\n    <span>\n      Motion\n    </span>\n  </label>\n  <label>\n    <input type=\"checkbox\" name=\"interests\" value=\"accessibility\" >\n    <span>\n      Accessibility\n    </span>\n  </label>\n  <label>\n    <input type=\"checkbox\" name=\"interests\" value=\"open source\" >\n    <span>\n      Open source\n    </span>\n  </label>\n</fieldset>",
    "cssBytes": 14856
  },
  {
    "id": "multi-step-form",
    "title": "Multistep form",
    "category": "Components",
    "description": "A short, validated sequence that stays a complete form without JavaScript.",
    "css": [
      "patterns",
      "form",
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/multi-step-form.html",
    "notes": [
      "Next validates the current step. Final submission validates every step and reveals invalid fields.",
      "Without JavaScript, all steps and the native submit button remain visible. Teardown restores this state.",
      "Replace the demo handler with your app submission and server-side validation."
    ],
    "html": "<form class=\"rf-stack\" data-rf-step-form data-demo-form method=\"dialog\">\n  <p class=\"rf-help\" role=\"status\">\n    Complete your project details\n  </p>\n  <fieldset class=\"rf-fieldset rf-stack\" data-rf-step>\n    <legend>\n      1. Your project\n    </legend>\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Project name\n      </span>\n      <input class=\"rf-input\" name=\"project\" required autocomplete=\"off\">\n    </label>\n  </fieldset>\n  <fieldset class=\"rf-fieldset rf-stack\" data-rf-step>\n    <legend>\n      2. Your contact\n    </legend>\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Contact email\n      </span>\n      <input class=\"rf-input\" type=\"email\" name=\"email\" required autocomplete=\"email\">\n    </label>\n  </fieldset>\n  <div class=\"rf-cluster\">\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-step-previous hidden>\n      Previous\n    </button>\n    <button class=\"rf-button\" type=\"button\" data-rf-step-next hidden>\n      Continue\n    </button>\n    <button class=\"rf-button\" type=\"submit\" data-rf-step-submit>\n      Finish demo\n    </button>\n  </div>\n  <p class=\"rf-help\">\n    Demo only. No data is submitted or stored.\n  </p>\n</form>",
    "cssBytes": 19573
  },
  {
    "id": "copy-button",
    "title": "Copy button",
    "category": "Components",
    "description": "Copy a text value with persistent success or failure feedback.",
    "css": [
      "button"
    ],
    "js": [
      "patterns"
    ],
    "file": "examples/components/copy-button.html",
    "notes": [
      "Clipboard requires a secure context and permission. Failure keeps the text visible for manual copying.",
      "The copied value is text. This component never executes the command."
    ],
    "html": "<div class=\"rf-stack\">\n  <code>\n    git clone https://github.com/robinfrancis186/rofin-ui.git\n  </code>\n  <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-copy=\"git clone https://github.com/robinfrancis186/rofin-ui.git\">\n    Copy command\n  </button>\n  <p class=\"rf-help\" role=\"status\">\n    Clone the source to get started.\n  </p>\n</div>",
    "cssBytes": 1624
  },
  {
    "id": "marquee",
    "title": "Pausable marquee",
    "category": "Components",
    "description": "A CSS content loop with an always-visible pause control.",
    "css": [
      "patterns",
      "form"
    ],
    "js": [],
    "file": "examples/components/marquee.html",
    "notes": [
      "Pause using the checkbox. Hover and focus also pause movement. Reduced-motion mode shows a static wrapping group.",
      "The repeated group is decorative and must not contain focusable controls. Studio names are fictional."
    ],
    "html": "<section class=\"rf-marquee\" aria-label=\"Sample studio names\">\n  <label class=\"rf-check\">\n    <input type=\"checkbox\">\n    Pause animation\n  </label>\n  <div class=\"rf-marquee__track\">\n    <div class=\"rf-marquee__group\">\n      <span>\n        Northstar\n      </span>\n      <span>\n        Forma\n      </span>\n      <span>\n        Orbit\n      </span>\n      <span>\n        Fieldwork\n      </span>\n    </div>\n    <div class=\"rf-marquee__group\" aria-hidden=\"true\">\n      <span>\n        Northstar\n      </span>\n      <span>\n        Forma\n      </span>\n      <span>\n        Orbit\n      </span>\n      <span>\n        Fieldwork\n      </span>\n    </div>\n  </div>\n</section>",
    "cssBytes": 17949
  },
  {
    "id": "grid-background",
    "title": "Grid background",
    "category": "Effects",
    "description": "A crisp repeating line grid, drawn in CSS.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/grid-background.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-grid-background\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "mesh-background",
    "title": "Mesh background",
    "category": "Effects",
    "description": "Two soft color fields using theme-aware gradients.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/mesh-background.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-mesh-background\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "aurora",
    "title": "Aurora background",
    "category": "Effects",
    "description": "A slowly moving wash of color behind readable content.",
    "css": [
      "effects",
      "card",
      "form"
    ],
    "js": [],
    "file": "examples/components/aurora.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize.",
      "The native pause checkbox stops the animation without JavaScript."
    ],
    "html": "<div class=\"rf-motion-control rf-stack\">\n  <label class=\"rf-check\">\n    <input type=\"checkbox\" data-rf-pause-motion>\n    Pause animation\n  </label>\n  <article class=\"rf-card rf-aurora\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n    <p class=\"rf-eyebrow\">\n      A little atmosphere\n    </p>\n    <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n      Make something\n      <br>\n      worth opening.\n    </h3>\n    <p class=\"rf-muted\">\n      Original CSS. Your own character.\n    </p>\n  </article>\n</div>",
    "cssBytes": 9502
  },
  {
    "id": "gradient-border",
    "title": "Gradient border",
    "category": "Effects",
    "description": "A two-color border around a solid, readable surface.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/gradient-border.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-gradient-border\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "border-beam",
    "title": "Border beam",
    "category": "Effects",
    "description": "A moving accent that follows the edge of a card.",
    "css": [
      "effects",
      "card",
      "form"
    ],
    "js": [],
    "file": "examples/components/border-beam.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize.",
      "The native pause checkbox stops the animation without JavaScript."
    ],
    "html": "<div class=\"rf-motion-control rf-stack\">\n  <label class=\"rf-check\">\n    <input type=\"checkbox\" data-rf-pause-motion>\n    Pause animation\n  </label>\n  <article class=\"rf-card rf-border-beam\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n    <p class=\"rf-eyebrow\">\n      A little atmosphere\n    </p>\n    <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n      Make something\n      <br>\n      worth opening.\n    </h3>\n    <p class=\"rf-muted\">\n      Original CSS. Your own character.\n    </p>\n  </article>\n</div>",
    "cssBytes": 9502
  },
  {
    "id": "glass-card",
    "title": "Glass card",
    "category": "Effects",
    "description": "A translucent surface with a solid-color fallback.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/glass-card.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-glass\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "tilt-card",
    "title": "Tilt card",
    "category": "Effects",
    "description": "A restrained perspective tilt that follows a mouse pointer.",
    "css": [
      "effects",
      "card"
    ],
    "js": [
      "effects"
    ],
    "file": "examples/components/tilt-card.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card \" data-rf-tilt style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "glare-card",
    "title": "Glare card",
    "category": "Effects",
    "description": "A pointer-following sheen over a readable card.",
    "css": [
      "effects",
      "card"
    ],
    "js": [
      "effects"
    ],
    "file": "examples/components/glare-card.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-glare\" data-rf-spotlight style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "lamp",
    "title": "Lamp highlight",
    "category": "Effects",
    "description": "A soft cone of light above a headline, using one gradient.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/lamp.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-lamp\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "stars",
    "title": "Star field",
    "category": "Effects",
    "description": "A static decorative star texture, with no particle loop.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/stars.html",
    "notes": [
      "Decorative effect only. Content remains usable without JavaScript.",
      "Animations and pointer motion honor prefers-reduced-motion. Override theme tokens locally to customize."
    ],
    "html": "<article class=\"rf-card rf-stars\"  style=\"padding:clamp(2rem,6vw,4rem);text-align:center\">\n  <p class=\"rf-eyebrow\">\n    A little atmosphere\n  </p>\n  <h3 style=\"font-size:clamp(1.5rem,4vw,2.5rem)\">\n    Make something\n    <br>\n    worth opening.\n  </h3>\n  <p class=\"rf-muted\">\n    Original CSS. Your own character.\n  </p>\n</article>",
    "cssBytes": 6409
  },
  {
    "id": "magnetic-button",
    "title": "Magnetic button",
    "category": "Effects",
    "description": "A small pointer attraction with an unchanged keyboard target.",
    "css": [
      "effects",
      "button"
    ],
    "js": [
      "effects"
    ],
    "file": "examples/components/magnetic-button.html",
    "notes": [
      "Movement is bounded to five pixels in each direction. Touch and reduced-motion users receive a static button."
    ],
    "html": "<div style=\"padding:1rem\">\n  <button class=\"rf-button\" type=\"button\" data-rf-magnetic data-demo-toast>\n    Make your next move →\n  </button>\n</div>",
    "cssBytes": 7140
  },
  {
    "id": "text-highlight",
    "title": "Text highlight",
    "category": "Effects",
    "description": "A theme-aware mark that wraps naturally across lines.",
    "css": [
      "effects"
    ],
    "js": [],
    "file": "examples/components/text-highlight.html",
    "notes": [
      "Real mark semantics. The highlight is static and does not depend on scroll or hover."
    ],
    "html": "<h3 style=\"font-size:clamp(1.75rem,5vw,3rem);line-height:1.25\">\n  Small ideas.\n  <br>\n  <mark class=\"rf-text-highlight\">\n    Wonderful possibilities.\n  </mark>\n</h3>",
    "cssBytes": 5516
  },
  {
    "id": "text-entrance",
    "title": "Text entrance",
    "category": "Effects",
    "description": "A single gentle entrance for a complete, readable heading.",
    "css": [
      "effects"
    ],
    "js": [],
    "file": "examples/components/text-entrance.html",
    "notes": [
      "Uses one real text node, with no duplicated words for assistive technology. Reduced-motion mode disables animation."
    ],
    "html": "<h3 class=\"rf-text-entrance\" style=\"font-size:clamp(1.75rem,5vw,3rem)\">\n  Every great thing\n  <br>\n  starts somewhere.\n</h3>",
    "cssBytes": 5516
  },
  {
    "id": "focus-cards",
    "title": "Focus cards",
    "category": "Effects",
    "description": "A subtle group emphasis on pointer hover or keyboard focus.",
    "css": [
      "effects",
      "card"
    ],
    "js": [],
    "file": "examples/components/focus-cards.html",
    "notes": [
      "Focus-within receives the same emphasis as hover. Reduced-motion mode removes movement."
    ],
    "html": "<div class=\"rf-focus-cards\">\n  <article class=\"rf-card\">\n    <h3>\n      Explore\n    </h3>\n    <p class=\"rf-muted\">\n      Open up a new direction.\n    </p>\n    <a href=\"#explore\">\n      Explore explore →\n    </a>\n  </article>\n  <article class=\"rf-card\">\n    <h3>\n      Build\n    </h3>\n    <p class=\"rf-muted\">\n      Bring your first sketch to life.\n    </p>\n    <a href=\"#build\">\n      Explore build →\n    </a>\n  </article>\n  <article class=\"rf-card\">\n    <h3>\n      Share\n    </h3>\n    <p class=\"rf-muted\">\n      Invite someone into your work.\n    </p>\n    <a href=\"#share\">\n      Explore share →\n    </a>\n  </article>\n</div>",
    "cssBytes": 6409
  },
  {
    "id": "logo-cloud",
    "title": "Logo cloud",
    "category": "Sections",
    "description": "A responsive strip of sample brand names.",
    "css": [
      "sections"
    ],
    "js": [],
    "file": "sections/logo-cloud.html",
    "notes": [
      "Fictional demonstration names, not endorsements. Replace with your real partners and accessible logos."
    ],
    "html": "<section class=\"rf-section\">\n  <p class=\"rf-eyebrow\" style=\"text-align:center\">\n    A sample partner strip\n  </p>\n  <div class=\"rf-logo-cloud\" aria-label=\"Fictional studios\">\n    <span>\n      Northstar\n    </span>\n    <span>\n      Forma\n    </span>\n    <span>\n      Orbit\n    </span>\n    <span>\n      Fieldwork\n    </span>\n  </div>\n</section>",
    "cssBytes": 4012
  },
  {
    "id": "newsletter",
    "title": "Newsletter",
    "category": "Sections",
    "description": "An inline email capture layout with native validation.",
    "css": [
      "sections",
      "card",
      "form",
      "button"
    ],
    "js": [],
    "file": "sections/newsletter.html",
    "notes": [
      "Replace the demo handler with your consent, email service, and server validation."
    ],
    "html": "<section class=\"rf-section rf-card\">\n  <h3 class=\"rf-section__heading\">\n    Good things, occasionally.\n  </h3>\n  <p class=\"rf-section__intro\">\n    A little inspiration for what you make next.\n  </p>\n  <form class=\"rf-newsletter\" data-demo-form method=\"dialog\">\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Email address\n      </span>\n      <input class=\"rf-input\" type=\"email\" name=\"email\" autocomplete=\"email\" required placeholder=\"you@example.com\">\n    </label>\n    <button class=\"rf-button\" type=\"submit\">\n      Subscribe\n    </button>\n  </form>\n  <p class=\"rf-help\" style=\"margin-top:1rem\">\n    Demo only. No subscription is created.\n  </p>\n</section>",
    "cssBytes": 9622
  },
  {
    "id": "team",
    "title": "Team grid",
    "category": "Sections",
    "description": "People and roles on simple, responsive profile cards.",
    "css": [
      "sections",
      "card",
      "avatar"
    ],
    "js": [],
    "file": "sections/team.html",
    "notes": [
      "Demo profiles are fictional. Use meaningful alt text for standalone profile images."
    ],
    "html": "<section class=\"rf-section\">\n  <h3 class=\"rf-section__heading\">\n    A few people. A shared idea.\n  </h3>\n  <p class=\"rf-section__intro\">\n    Fictional profiles for a sample team layout.\n  </p>\n  <div class=\"rf-grid\">\n    <article class=\"rf-card\">\n      <span class=\"rf-avatar\" aria-hidden=\"true\">\n        AM\n      </span>\n      <h4>\n        Alex Morgan\n      </h4>\n      <p class=\"rf-muted\">\n        Design\n      </p>\n    </article>\n    <article class=\"rf-card\">\n      <span class=\"rf-avatar\" aria-hidden=\"true\">\n        JL\n      </span>\n      <h4>\n        Jamie Lee\n      </h4>\n      <p class=\"rf-muted\">\n        Engineering\n      </p>\n    </article>\n    <article class=\"rf-card\">\n      <span class=\"rf-avatar\" aria-hidden=\"true\">\n        SC\n      </span>\n      <h4>\n        Sam Chen\n      </h4>\n      <p class=\"rf-muted\">\n        Product\n      </p>\n    </article>\n  </div>\n</section>",
    "cssBytes": 5466
  },
  {
    "id": "blog-grid",
    "title": "Article grid",
    "category": "Sections",
    "description": "A responsive editorial collection with real links.",
    "css": [
      "sections",
      "card"
    ],
    "js": [],
    "file": "sections/blog-grid.html",
    "notes": [
      "Replace sample article text and fragment links with real content and destinations."
    ],
    "html": "<section class=\"rf-section\">\n  <h3 class=\"rf-section__heading\">\n    Notes from the studio.\n  </h3>\n  <p class=\"rf-section__intro\">\n    A little reading for your next chapter.\n  </p>\n  <div class=\"rf-grid\">\n    <article class=\"rf-card\">\n      <p class=\"rf-eyebrow\">\n        Design\n      </p>\n      <h4>\n        Start with the essentials\n      </h4>\n      <p class=\"rf-muted\">\n        Leave space for what matters.\n      </p>\n      <a href=\"#article-0\">\n        Read article →\n      </a>\n    </article>\n    <article class=\"rf-card\">\n      <p class=\"rf-eyebrow\">\n        Craft\n      </p>\n      <h4>\n        The details add up\n      </h4>\n      <p class=\"rf-muted\">\n        Make one small improvement each day.\n      </p>\n      <a href=\"#article-1\">\n        Read article →\n      </a>\n    </article>\n    <article class=\"rf-card\">\n      <p class=\"rf-eyebrow\">\n        Ideas\n      </p>\n      <h4>\n        Build in the open\n      </h4>\n      <p class=\"rf-muted\">\n        A useful conversation starts with a small sketch.\n      </p>\n      <a href=\"#article-2\">\n        Read article →\n      </a>\n    </article>\n  </div>\n</section>",
    "cssBytes": 4905
  },
  {
    "id": "sign-in",
    "title": "Sign-in form",
    "category": "Sections",
    "description": "A focussed account form with native autocomplete and validation.",
    "css": [
      "sections",
      "card",
      "form",
      "button",
      "patterns"
    ],
    "js": [
      "patterns"
    ],
    "file": "sections/sign-in.html",
    "notes": [
      "This is an interface, not authentication. Wire your own trusted authentication backend and error handling.",
      "The preview prevents submission and sends no data."
    ],
    "html": "<section class=\"rf-card rf-auth\">\n  <h3>\n    Welcome back.\n  </h3>\n  <p class=\"rf-muted\">\n    A little closer to your next idea.\n  </p>\n  <form data-demo-form method=\"dialog\">\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Email\n      </span>\n      <input class=\"rf-input\" type=\"email\" name=\"email\" autocomplete=\"username\" required>\n    </label>\n    <div class=\"rf-field\" data-rf-password>\n      <label class=\"rf-label\" for=\"signin-password\">Password</label>\n      <div class=\"rf-input-action\">\n        <input class=\"rf-input\" id=\"signin-password\" type=\"password\" name=\"password\" autocomplete=\"current-password\" required>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-password-toggle aria-label=\"Show password\" aria-controls=\"signin-password\" aria-pressed=\"false\" hidden>Show</button>\n      </div>\n    </div>\n    <button class=\"rf-button\" type=\"submit\">\n      Sign in\n    </button>\n  </form>\n  <p class=\"rf-help\" style=\"margin-top:1rem\">\n    Preview only. Do not enter a real password.\n  </p>\n</section>",
    "cssBytes": 24478
  },
  {
    "id": "integration-map",
    "title": "Integration map",
    "category": "Sections",
    "description": "A semantic hub-and-spoke layout for connected tools.",
    "css": [
      "sections",
      "card",
      "effects"
    ],
    "js": [],
    "file": "sections/integration-map.html",
    "notes": [
      "A visual diagram only. It makes no network connections or claims about integration availability."
    ],
    "html": "<section class=\"rf-section rf-integration-map\">\n  <h3 class=\"rf-section__heading\" style=\"margin-inline:auto\">\n    Everything in its place.\n  </h3>\n  <p class=\"rf-muted\">\n    A sample view of connected tools.\n  </p>\n  <div class=\"rf-card rf-gradient-border\">\n    <strong>\n      Your workspace\n    </strong>\n    <p class=\"rf-muted\">\n      One shared starting point\n    </p>\n  </div>\n  <ul aria-label=\"Sample integrations\">\n    <li>\n      Design files\n    </li>\n    <li>\n      Project notes\n    </li>\n    <li>\n      Team calendar\n    </li>\n    <li>\n      Release updates\n    </li>\n  </ul>\n</section>",
    "cssBytes": 10421
  },
  {
    "id": "combobox",
    "title": "Combobox",
    "category": "Components",
    "description": "Search a fixed set of choices with a labelled, keyboard-friendly combobox.",
    "css": [
      "form",
      "card",
      "button",
      "form-patterns"
    ],
    "js": [
      "form-patterns"
    ],
    "file": "examples/components/combobox.html",
    "notes": [
      "The native select supplies form values and remains usable without JavaScript.",
      "Arrow keys skip disabled choices; Enter commits and Escape restores the previous choice.",
      "Exact typed labels are accepted. Other text is invalid. Reinitialize when changing the option structure."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\">\n  <div class=\"rf-field\" data-rf-combobox>\n    <label class=\"rf-label\" for=\"project-template\">Project template</label>\n    <select class=\"rf-select\" id=\"project-template\" name=\"template\" required aria-describedby=\"template-help\">\n      <option value=\"\">Choose a template</option><option value=\"website\" selected>Website launch</option><option value=\"dashboard\">Analytics dashboard</option><option value=\"store\">Online store</option><option value=\"mobile\" disabled>Mobile app · coming soon</option>\n    </select>\n    <p class=\"rf-help\" id=\"template-help\">Type to search, use arrow keys, then Enter to choose. Escape restores your last choice.</p>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Use template</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset template</button></div>\n</form>",
    "cssBytes": 7807
  },
  {
    "id": "autocomplete",
    "title": "Autocomplete",
    "category": "Components",
    "description": "Native suggestions with room to enter a topic of your own.",
    "css": [
      "form",
      "card",
      "button"
    ],
    "js": [],
    "file": "examples/components/autocomplete.html",
    "notes": [
      "Uses input with datalist, without JavaScript. Browser suggestion appearance and assistive-technology support vary.",
      "Suggestions are optional; free text remains valid. Use Combobox when selection must match a fixed option."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\">\n  <label class=\"rf-field\"><span class=\"rf-label\">Project topic</span><input class=\"rf-input\" name=\"topic\" list=\"topic-suggestions\" autocomplete=\"off\" maxlength=\"80\" aria-describedby=\"topic-help\"><span class=\"rf-help\" id=\"topic-help\">Choose a suggestion or enter your own topic.</span></label>\n  <datalist id=\"topic-suggestions\"><option value=\"Accessibility\"></option><option value=\"Analytics\"></option><option value=\"Design systems\"></option><option value=\"Documentation\"></option><option value=\"Web performance\"></option></datalist>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Save topic</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset topic</button></div>\n</form>",
    "cssBytes": 5610
  },
  {
    "id": "multiselect",
    "title": "Multiselect",
    "category": "Components",
    "description": "Search choices, select several, and remove them with accessible chips.",
    "css": [
      "form",
      "card",
      "button",
      "form-patterns"
    ],
    "js": [
      "form-patterns"
    ],
    "file": "examples/components/multiselect.html",
    "notes": [
      "The native multiple select owns repeated form values. Checkbox and search controls have no duplicate names.",
      "Clear preserves disabled selections. Required fields need at least one selection.",
      "Reinitialize when changing the option structure. Without JavaScript, use the native multiple select."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\">\n  <fieldset class=\"rf-fieldset\" data-rf-multiselect data-rf-multiselect-label=\"Project skills\"><legend>Project skills</legend>\n    <label class=\"rf-field\" for=\"project-skills\"><span class=\"rf-label\">Choose one or more skills</span><select class=\"rf-select\" id=\"project-skills\" name=\"skills\" multiple required size=\"5\"><option value=\"design\" selected>Design</option><option value=\"accessibility\">Accessibility</option><option value=\"engineering\">Engineering</option><option value=\"research\">Research</option><option value=\"video\" disabled>Video · unavailable</option></select></label>\n  </fieldset>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Save skills</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset skills</button></div>\n</form>",
    "cssBytes": 7807
  },
  {
    "id": "form-error-summary",
    "title": "Form error summary",
    "category": "Components",
    "description": "A focused summary links each native validation error to its field.",
    "css": [
      "form",
      "card",
      "button",
      "alert",
      "form-patterns"
    ],
    "js": [
      "form-patterns"
    ],
    "file": "examples/components/form-error-summary.html",
    "notes": [
      "Enhanced forms show a linked summary and inline native validation messages.",
      "Original aria-describedby and aria-invalid values are restored on correction, reset, and teardown.",
      "Honor defaultPrevented in submission handlers. Server validation is still required."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-rf-validation data-demo-form method=\"dialog\">\n  <div class=\"rf-alert\" data-variant=\"danger\" data-rf-errors role=\"alert\" tabindex=\"-1\" hidden><strong>Check these fields</strong><ul></ul></div>\n  <label class=\"rf-field\" for=\"summary-name\"><span class=\"rf-label\">Your name</span><input class=\"rf-input\" id=\"summary-name\" name=\"name\" autocomplete=\"name\" required maxlength=\"80\"></label>\n  <label class=\"rf-field\" for=\"summary-email\"><span class=\"rf-label\">Email address</span><input class=\"rf-input\" id=\"summary-email\" name=\"email\" type=\"email\" autocomplete=\"email\" required aria-describedby=\"summary-email-help\"><span class=\"rf-help\" id=\"summary-email-help\">Use an address you can receive messages at.</span></label>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Check form</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset form</button></div>\n</form>",
    "cssBytes": 8531
  },
  {
    "id": "calendar",
    "title": "Calendar",
    "category": "Components",
    "description": "Navigate a month with arrow keys and keep a native date field in sync.",
    "css": [
      "form",
      "card",
      "button",
      "form-patterns"
    ],
    "js": [
      "form-patterns"
    ],
    "file": "examples/components/calendar.html",
    "notes": [
      "Arrows move by day/week, Home/End within the week, Page Up/Down by month. Enter or Space selects.",
      "Uses local calendar dates without UTC conversion. Native min/max bounds disable unavailable days.",
      "The date input remains usable without JavaScript. Calendar labels follow data-rf-locale; weekday order starts Monday."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\">\n  <div class=\"rf-calendar rf-stack\" data-rf-calendar data-rf-locale=\"en-GB\">\n    <label class=\"rf-field\"><span class=\"rf-label\">Launch date</span><input class=\"rf-input\" type=\"date\" name=\"date\" value=\"2026-10-02\" min=\"2026-09-01\" max=\"2027-12-31\" required aria-describedby=\"calendar-help\"></label>\n    <div data-rf-calendar-controls hidden><div class=\"rf-calendar__toolbar\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-calendar-month=\"-1\" aria-label=\"Previous month\">←</button><strong data-rf-calendar-title></strong><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-calendar-month=\"1\" aria-label=\"Next month\">→</button></div><table class=\"rf-calendar__grid\" data-rf-calendar-grid></table></div>\n    <p class=\"rf-help\" id=\"calendar-help\">Arrow keys move by day or week. Page Up/Down changes month, Home/End moves within the week. Enter selects.</p>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Save date</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset date</button></div>\n</form>",
    "cssBytes": 7807
  },
  {
    "id": "time-picker",
    "title": "Time picker",
    "category": "Components",
    "description": "A native time control with working-hour bounds and quarter-hour steps.",
    "css": [
      "form",
      "card",
      "button"
    ],
    "js": [],
    "file": "examples/components/time-picker.html",
    "notes": [
      "Uses native type=time, min/max and step. Appearance follows the browser and operating system.",
      "Times do not contain a time zone. The application supplies the workspace zone and resolves daylight-saving ambiguity."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-demo-form method=\"dialog\">\n  <label class=\"rf-field\"><span class=\"rf-label\">Meeting time</span><input class=\"rf-input\" name=\"time\" type=\"time\" value=\"09:30\" min=\"08:00\" max=\"18:00\" step=\"900\" required aria-describedby=\"meeting-time-help\"><span class=\"rf-help\" id=\"meeting-time-help\">08:00–18:00 in 15-minute steps. Times use your workspace’s time zone.</span></label>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Save time</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset time</button></div>\n</form>",
    "cssBytes": 5610
  },
  {
    "id": "date-range-presets",
    "title": "Date-range presets",
    "category": "Components",
    "description": "Choose an inclusive reporting period using practical date shortcuts.",
    "css": [
      "form",
      "card",
      "button",
      "form-patterns"
    ],
    "js": [
      "patterns",
      "form-patterns"
    ],
    "file": "examples/components/date-range-presets.html",
    "notes": [
      "Last 7 days includes today. Previous month handles month and year boundaries.",
      "Remove data-rf-today to use the current local date; this example fixes it for predictable sample data.",
      "Shortcuts outside native min/max bounds preserve the prior range and announce the restriction. Reset restores native values."
    ],
    "html": "<form class=\"rf-card rf-stack\" data-rf-date-range data-rf-date-presets data-rf-today=\"2026-10-02\" data-demo-form method=\"dialog\">\n  <fieldset class=\"rf-fieldset\"><legend>Reporting period</legend><div class=\"rf-grid\" style=\"--rf-column:12rem\"><label class=\"rf-field\"><span class=\"rf-label\">Start date</span><input class=\"rf-input\" type=\"date\" name=\"start\" value=\"2026-09-01\" data-rf-date-start required></label><label class=\"rf-field\"><span class=\"rf-label\">End date</span><input class=\"rf-input\" type=\"date\" name=\"end\" value=\"2026-09-30\" data-rf-date-end required></label></div></fieldset>\n  <div class=\"rf-cluster\" aria-label=\"Date shortcuts\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-date-preset=\"today\">Today</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-date-preset=\"week\">Last 7 days</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-date-preset=\"month\">This month</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-date-preset=\"previous-month\">Previous month</button></div>\n  <p class=\"rf-help\" role=\"status\">Example today: 2 October 2026. Presets include both start and end dates.</p>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Apply period</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset period</button></div>\n</form>",
    "cssBytes": 7807
  },
  {
    "id": "event-scheduler",
    "title": "Event scheduler",
    "category": "Sections",
    "description": "Create, edit, and remove events with native dates, times, and clear validation.",
    "css": [
      "form",
      "card",
      "button",
      "alert",
      "form-patterns"
    ],
    "js": [
      "form-patterns"
    ],
    "file": "sections/event-scheduler.html",
    "notes": [
      "Events are ordered by date and time. End time must be after start time; events stay within one calendar day.",
      "rf:schedule-change supplies a copied event array for your application to persist. The example stores changes only in the page session.",
      "Titles are rendered as text. Times require your workspace time zone; overnight events need a separate end date."
    ],
    "html": "<section class=\"rf-stack\" data-rf-scheduler aria-label=\"Event scheduler\">\n  <div><h3>Make time for what matters.</h3><p class=\"rf-muted\">Create and edit a daily schedule. Changes last for this page session.</p></div>\n  <form class=\"rf-card rf-stack\" data-rf-event-form data-rf-validation data-demo-form method=\"dialog\">\n    <div class=\"rf-alert\" data-variant=\"danger\" data-rf-errors role=\"alert\" tabindex=\"-1\" hidden><strong>Check your event</strong><ul></ul></div>\n    <input type=\"hidden\" name=\"eventId\" value=\"\">\n    <label class=\"rf-field\"><span class=\"rf-label\">Event title</span><input class=\"rf-input\" name=\"title\" required maxlength=\"120\"></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Event date</span><input class=\"rf-input\" type=\"date\" name=\"date\" value=\"2026-10-02\" required></label>\n    <div class=\"rf-grid\" style=\"--rf-column:10rem\"><label class=\"rf-field\"><span class=\"rf-label\">Start time</span><input class=\"rf-input\" type=\"time\" name=\"start\" value=\"09:00\" required></label><label class=\"rf-field\"><span class=\"rf-label\">End time</span><input class=\"rf-input\" type=\"time\" name=\"end\" value=\"09:30\" required></label></div>\n    <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\" data-rf-event-save>Add event</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Cancel edit</button></div>\n  </form>\n  <p class=\"rf-help\" role=\"status\" data-rf-event-status>1 event scheduled. Times use your workspace’s time zone.</p>\n  <ul class=\"rf-stack\" data-rf-events style=\"list-style:none;margin:0;padding:0\"><li class=\"rf-card rf-stack\" data-rf-event-id=\"kickoff\" data-rf-event-date=\"2026-10-02\" data-rf-event-start=\"10:00\" data-rf-event-end=\"10:30\"><strong data-rf-event-title>Project kickoff</strong><time datetime=\"2026-10-02T10:00\">2026-10-02 · 10:00–10:30</time></li></ul>\n</section>",
    "cssBytes": 8531
  },
  {
    "id": "data-grid",
    "title": "Advanced data table",
    "category": "Components",
    "description": "Edit cells, pin and resize columns, save filtered views, and explore a virtual window of 10,000 projects.",
    "css": [
      "form",
      "button",
      "table",
      "data-grid"
    ],
    "js": [
      "data-grid"
    ],
    "file": "examples/components/data-grid.html",
    "notes": [
      "Native cells remain readable without JavaScript. createDataGrid enhances a fallback table; your application supplies rows and stable IDs.",
      "Column settings include visibility, sticky pinning, pointer/keyboard resizing and saved browser views. Compound filters support all/any matching. Edits validate native text, numeric, date and select controls; Enter saves and Escape cancels.",
      "Virtual scrolling keeps a bounded row window with aria-rowcount/index. Turn it off for native paginated reading. Client filtering/sorting runs in memory; loadPage supplies server pages for larger datasets.",
      "The 10,000-row gallery is generated sample data. Its read-only HTTP paging option runs on the repository development server and is unavailable on the static production site. Applications supply loadPage/saveCell callbacks, server validation, authorization and durable storage.",
      "Saved views contain filters and column settings, not row data. Browser storage is optional; edits remain in the controller until the application persists them. Call destroy() before unmounting."
    ],
    "html": "<section class=\"rf-stack rf-data-grid\" data-rf-data-grid data-rf-grid-storage=\"rofin-project-grid-views-v1\" aria-label=\"Project explorer\">\n  <div><h3>Every project, within reach.</h3><p class=\"rf-muted\">Edit a cell, shape a view, and keep the columns you care about close.</p></div>\n  <div class=\"rf-field\" data-rf-grid-demo-source hidden><label class=\"rf-label\" for=\"grid-data-source\">Data source</label><select class=\"rf-select\" id=\"grid-data-source\" data-rf-grid-source><option value=\"browser\">Browser rows · editable</option><option value=\"http\">Local HTTP pages · read only</option></select></div>\n  <p class=\"rf-help\" data-rf-grid-note>Edits last for this page session. Saved views stay in this browser. The local HTTP example runs with the repository's development server; production applications supply their own loader and authorization.</p>\n  <div class=\"rf-grid-scroll\" data-rf-grid-scroll tabindex=\"0\" role=\"region\" aria-label=\"Scrollable project table\">\n    <table class=\"rf-table rf-grid-table\"><caption>Generated project sample.</caption><thead><tr><th scope=\"col\" data-rf-field=\"name\" data-rf-editable data-rf-width=\"260\" data-rf-max-length=\"80\">Project</th><th scope=\"col\" data-rf-field=\"owner\" data-rf-editable data-rf-width=\"180\" data-rf-max-length=\"50\">Owner</th><th scope=\"col\" data-rf-field=\"status\" data-rf-editable data-rf-width=\"180\" data-rf-options='[\"Draft\",\"In progress\",\"Published\"]'>Status</th><th scope=\"col\" data-rf-field=\"tasks\" data-rf-type=\"number\" data-rf-editable data-rf-width=\"140\" data-rf-min=\"0\" data-rf-max=\"1000\" data-rf-step=\"1\">Tasks</th><th scope=\"col\" data-rf-field=\"updated\" data-rf-type=\"date\" data-rf-editable data-rf-width=\"180\">Updated</th></tr></thead><tbody>\n      <tr data-rf-id=\"project-1\"><th scope=\"row\">Atlas launch</th><td>Robin</td><td>Draft</td><td>0</td><td>2026-09-01</td></tr>\n      <tr data-rf-id=\"project-2\"><th scope=\"row\">Mobile journal</th><td>Jamie</td><td>In progress</td><td>1</td><td>2026-09-02</td></tr>\n      <tr data-rf-id=\"project-3\"><th scope=\"row\">Brand refresh</th><td>Alex</td><td>Published</td><td>2</td><td>2026-09-03</td></tr>\n      <tr data-rf-id=\"project-4\"><th scope=\"row\">Component library</th><td>Robin</td><td>Draft</td><td>3</td><td>2026-09-04</td></tr>\n      <tr data-rf-id=\"project-5\"><th scope=\"row\">Customer portal</th><td>Jamie</td><td>In progress</td><td>4</td><td>2026-09-05</td></tr>\n      <tr data-rf-id=\"project-6\"><th scope=\"row\">Onboarding flow</th><td>Alex</td><td>Published</td><td>5</td><td>2026-09-06</td></tr>\n    </tbody></table>\n  </div>\n</section>",
    "cssBytes": 7660
  },
  {
    "id": "upload-queue",
    "title": "Upload queue",
    "category": "Components",
    "description": "Preview files, validate a queue, and transfer with real progress, cancellation and retry.",
    "css": [
      "form",
      "upload",
      "button",
      "progress",
      "upload-queue"
    ],
    "js": [
      "upload-queue"
    ],
    "file": "examples/components/upload-queue.html",
    "notes": [
      "Files stay local until an explicit Upload action invokes the application callback. Native file selection remains available without scripts.",
      "The queue validates declared file types, size and count; your server validates actual content and authorization. Image previews use revocable object URLs. Empty files are rejected.",
      "Cancel keeps the file for an explicit Retry. Removing a row only removes it from this queue. Form reset cancels active work and clears selections; cancelled resets retain the queue.",
      "uploadFile uses native XMLHttpRequest upload progress, with no fake timer or automatic retry. The callback receives an AbortSignal and a stable upload ID for application idempotency.",
      "The local development receiver checks file signatures and UTF-8 text, stores temporary files, and cleans interrupted transfers. It is a public localhost sample, not authorized durable storage; static production keeps transfers disabled.",
      "At most 100 files can be configured; the default is 10 files of 8 MB each, with two simultaneous uploads. Call destroy() before unmounting; getFiles() retains the selected File objects for application use."
    ],
    "html": "<form method=\"dialog\" class=\"rf-stack\" data-rf-upload-form>\n  <section class=\"rf-stack rf-upload-queue\" data-rf-upload-queue data-rf-max-size=\"8388608\" data-rf-max-files=\"10\" aria-label=\"Project upload queue\">\n    <div><h3>Give your files a place.</h3><p class=\"rf-muted\">Review the queue, keep what matters, and send it when you're ready.</p></div>\n    <div class=\"rf-upload\" data-rf-drop-zone>\n      <label class=\"rf-label\" for=\"queue-files\">Files to add</label>\n      <p class=\"rf-help\" id=\"queue-files-help\">Choose or drop PNG, JPEG, WebP, PDF or text files. Up to 10 files, 8 MB each.</p>\n      <input id=\"queue-files\" type=\"file\" accept=\".png,.jpg,.jpeg,.webp,.pdf,.txt\" multiple aria-describedby=\"queue-files-help\">\n    </div>\n    <p class=\"rf-help\" data-rf-upload-demo-note>Files stay on your device until you choose Upload. Transfers require your application's upload callback.</p>\n    <ol class=\"rf-upload-items\" data-rf-upload-items aria-label=\"Selected files\"></ol>\n  </section>\n  <div><button type=\"reset\" class=\"rf-button rf-button--outline rf-button--small\">Reset file queue</button></div>\n</form>",
    "cssBytes": 7296
  },
  {
    "id": "workspace-switcher",
    "title": "Workspace switcher",
    "category": "Components",
    "description": "Move between team, personal and experimental workspaces with native navigation and clear current context.",
    "css": [
      "button",
      "avatar",
      "dropdown",
      "account-menu"
    ],
    "js": [
      "dropdown"
    ],
    "file": "examples/components/workspace-switcher.html",
    "notes": [
      "Reuses the native popover and initDropdowns keyboard behavior, including arrows, Home/End, typeahead and Escape. Native links target application workspace URLs.",
      "The composed dashboard switches actual sample projects, boards, inboxes, preferences, charts and team/activity views. Each workspace retains its edits until reload; selection, filters and unsaved forms clear when context changes.",
      "Names and current-state indicators are text-safe. The public examples do not authenticate accounts or enforce membership; applications authorize workspace access on their server.",
      "Replace the sample URLs with your own workspace routes. Disabled workspaces are skipped during keyboard navigation. Current state uses aria-current and a visible label."
    ],
    "html": "<div class=\"rf-workspace-switcher\" data-rf-dropdown data-demo-navigation>\n  <button class=\"rf-button rf-button--outline rf-account-trigger\" type=\"button\" popovertarget=\"workspace-menu\" aria-label=\"Switch workspace: Studio\" data-dashboard-workspace-trigger><span class=\"rf-avatar\" aria-hidden=\"true\" data-workspace-avatar>ST</span><span class=\"rf-account-label\"><span data-workspace-name>Studio</span> workspace</span><span aria-hidden=\"true\">⌄</span></button>\n  <div class=\"rf-menu rf-workspace-menu\" id=\"workspace-menu\" popover role=\"menu\" aria-label=\"Workspaces\">\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=studio#overview\" data-dashboard-workspace=\"studio\" aria-label=\"Studio workspace\" aria-current=\"true\"><span class=\"rf-avatar\" aria-hidden=\"true\" data-workspace-option-avatar=\"studio\">ST</span><span class=\"rf-stack\"><strong data-workspace-option-name=\"studio\">Studio</strong><small class=\"rf-muted\">Team workspace · 3 members</small></span><span class=\"rf-badge\" data-workspace-current=\"studio\">Current</span></a>\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=personal#overview\" data-dashboard-workspace=\"personal\" aria-label=\"Personal workspace\"><span class=\"rf-avatar\" aria-hidden=\"true\" data-workspace-option-avatar=\"personal\">PE</span><span class=\"rf-stack\"><strong data-workspace-option-name=\"personal\">Personal</strong><small class=\"rf-muted\">A little room for your own ideas</small></span><span class=\"rf-badge\" data-workspace-current=\"personal\" hidden>Current</span></a>\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=lab#overview\" data-dashboard-workspace=\"lab\" aria-label=\"Lab workspace\"><span class=\"rf-avatar\" aria-hidden=\"true\" data-workspace-option-avatar=\"lab\">LA</span><span class=\"rf-stack\"><strong data-workspace-option-name=\"lab\">Lab</strong><small class=\"rf-muted\">Shared experiments · 2 members</small></span><span class=\"rf-badge\" data-workspace-current=\"lab\" hidden>Current</span></a>\n    <hr class=\"rf-menu__separator\" role=\"separator\">\n    <button type=\"button\" role=\"menuitem\" disabled>Archived workspace</button>\n  </div>\n</div>",
    "cssBytes": 3865
  },
  {
    "id": "account-menu",
    "title": "Account menu",
    "category": "Components",
    "description": "A familiar place for your profile, workspace navigation and help, using the shared dropdown and avatar.",
    "css": [
      "button",
      "avatar",
      "dropdown",
      "account-menu"
    ],
    "js": [
      "dropdown"
    ],
    "file": "examples/components/account-menu.html",
    "notes": [
      "Profile & preferences links to the working dashboard drawer. Workspace links preserve the active workspace in the composed dashboard; documentation links reach the JavaScript API page.",
      "The shared dropdown owns keyboard focus, typeahead, Escape and teardown. A complete account name remains in the accessible trigger label when the visible name is truncated.",
      "Sign out is disabled in these public samples because they have no authenticated session. Enable and bind it to your actual sign-out service; the component does not create or end account sessions.",
      "Replace sample links with your application routes and update displayed account data after confirmed profile changes."
    ],
    "html": "<div data-rf-dropdown data-demo-navigation>\n  <button class=\"rf-button rf-button--outline rf-account-trigger\" type=\"button\" popovertarget=\"account-menu\" aria-label=\"Account menu for Robin Francis\" data-dashboard-account-trigger><span class=\"rf-avatar\" aria-hidden=\"true\" data-profile-avatar>RF</span><span class=\"rf-account-label\" data-account-name>Robin Francis</span><span aria-hidden=\"true\">⌄</span></button>\n  <div class=\"rf-menu rf-account-menu\" id=\"account-menu\" popover role=\"menu\" aria-label=\"Account\">\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=studio&panel=account#overview\" data-dashboard-account-link=\"profile\">Profile & preferences</a>\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=studio#overview\" data-dashboard-account-link=\"overview\">Workspace overview</a>\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=studio#projects\" data-dashboard-account-link=\"projects\">Your projects</a>\n    <a role=\"menuitem\" href=\"../examples/dashboard.html?workspace=studio#billing\" data-dashboard-account-link=\"billing\">Billing & usage</a>\n    <hr class=\"rf-menu__separator\" role=\"separator\">\n    <a role=\"menuitem\" href=\"https://rofin-ui.vercel.app/#api\">Documentation & help</a>\n    <button type=\"button\" role=\"menuitem\" disabled aria-describedby=\"account-session-note\">Sign out</button>\n  </div>\n  <span class=\"rf-sr-only\" id=\"account-session-note\">This public sample has no authenticated account session.</span>\n</div>",
    "cssBytes": 3865
  },
  {
    "id": "team-management",
    "title": "Team management",
    "category": "Components",
    "description": "Invite collaborators, edit roles and revoke invitations with explicit application callbacks.",
    "css": [
      "form",
      "button",
      "table",
      "dialog",
      "alert",
      "team-management"
    ],
    "js": [
      "team-management"
    ],
    "file": "examples/components/team-management.html",
    "notes": [
      "Native labelled forms and a readable table remain available without scripts. The optional controller renders text safely and waits for confirmed changes before committing.",
      "Owners manage all roles; admins manage editors and viewers. The shared server policy prevents removal or demotion of the last owner. Project, file and billing permissions are enforced by your application separately.",
      "Change and load callbacks receive AbortSignals; mutations receive an expected workspace revision. Failed or stale changes preserve the current snapshot and unsaved role selection. Call destroy before unmounting.",
      "The default gallery and composed dashboard use isolated page-session state. The explicit localhost option creates a private sample with server-issued access tokens, one-use invitation links, role checks and revision conflicts.",
      "Local links grant their holder the configured role; they do not verify the recipient email. Private samples expire after 15 minutes or server stop. Real accounts, durable storage and email delivery remain application services.",
      "Snapshots are bounded to 50 members and 20 pending invitations. Larger teams require application paging and an appropriate server policy; the sample is not an unbounded directory."
    ],
    "html": "<section class=\"rf-stack\" data-rf-team-manager data-demo-navigation aria-labelledby=\"team-manager-title\">\n  <div><p class=\"rf-eyebrow\">A shared idea, with clear access.</p><h3 id=\"team-manager-title\"><span data-rf-team-name>Studio</span> team</h3><p class=\"rf-muted\"><span data-rf-team-count>3</span> members · Your role: <strong data-rf-team-current-role>Owner</strong></p></div>\n  <p class=\"rf-help\" data-rf-team-note>Page-session sample. Invitations create pending rows; no email or account access is provided.</p>\n  <div class=\"rf-cluster\"><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-team-local hidden>Start isolated local team</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-team-page hidden>Return to page sample</button><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-team-refresh disabled>Refresh team</button></div>\n  <form class=\"rf-team-toolbar\" data-rf-team-invite-form method=\"dialog\">\n    <label class=\"rf-field\"><span class=\"rf-label\">Invitation email</span><input class=\"rf-input\" type=\"email\" name=\"email\" maxlength=\"254\" autocomplete=\"off\" required disabled></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Invitation role</span><select class=\"rf-select\" name=\"role\" disabled><option value=\"viewer\" selected>Viewer</option><option value=\"editor\">Editor</option><option value=\"admin\">Admin</option><option value=\"owner\">Owner</option></select></label>\n    <button class=\"rf-button\" type=\"submit\" disabled>Create invitation</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Clear invitation form</button>\n  </form>\n  <p class=\"rf-alert\" data-variant=\"danger\" role=\"alert\" data-rf-team-error hidden></p><p class=\"rf-help\" role=\"status\" data-rf-team-status></p>\n  <label class=\"rf-field\"><span class=\"rf-label\">Search team members</span><input class=\"rf-input\" type=\"search\" data-rf-team-search maxlength=\"200\"></label>\n  <div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Team members\"><table class=\"rf-table rf-team-members\"><caption>Members and their workspace access. At least one owner must remain.</caption><thead><tr><th scope=\"col\">Member</th><th scope=\"col\">Role</th><th scope=\"col\">Actions</th></tr></thead><tbody data-rf-team-members>\n    <tr><th scope=\"row\">Robin Francis<p class=\"rf-help\">robin@example.com</p></th><td>Owner</td><td>Last owner protected</td></tr><tr><th scope=\"row\">Jamie Lee<p class=\"rf-help\">jamie@example.com</p></th><td>Editor</td><td>Application controls required</td></tr><tr><th scope=\"row\">Alex Morgan<p class=\"rf-help\">alex@example.com</p></th><td>Viewer</td><td>Application controls required</td></tr>\n  </tbody></table></div>\n  <p class=\"rf-help\" data-rf-team-empty hidden>No members match this search.</p>\n  <div><h4>Pending invitations</h4><ul class=\"rf-team-invitations\" data-rf-team-invitations><li class=\"rf-help\">No pending invitations.</li></ul></div>\n  <p class=\"rf-help\">Owners manage all roles. Admins manage editors and viewers. Editors and viewers cannot manage other members. Everyone can leave unless they are the last owner. <a href=\"https://rofin-ui.vercel.app/#component/permissions-matrix\">View the role permissions →</a></p>\n  <dialog class=\"rf-dialog\" data-rf-team-confirm><h3 class=\"rf-dialog__title\">Confirm access change</h3><p data-rf-team-confirm-text></p><p class=\"rf-alert\" data-variant=\"danger\" role=\"alert\" data-rf-team-confirm-error hidden></p><form method=\"dialog\" class=\"rf-dialog__actions\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-team-cancel>Keep current access</button><button class=\"rf-button\" type=\"submit\">Confirm change</button></form></dialog>\n</section>",
    "cssBytes": 7578
  },
  {
    "id": "team-invitation",
    "title": "Team invitation",
    "category": "Components",
    "description": "Accept a workspace invitation with native validation and clear access context.",
    "css": [
      "card",
      "form",
      "button",
      "alert"
    ],
    "js": [],
    "file": "examples/components/team-invitation.html",
    "notes": [
      "The gallery previews accepting a page-session invitation. Native name validation and reset remain available; no account or email is created.",
      "Invitations issued by the isolated localhost service open a dedicated acceptance page. The server validates the token, expiry and latest role, consumes the link once, and issues access bound to the new membership.",
      "A local invitation grants access to its holder, not a verified email identity. The dedicated page keeps its access token in memory and disables production acceptance until an application service is configured.",
      "Bind the native form to your application acceptance callback. The optional team policy runs on the server after verifying the invitation; it does not submit this form automatically."
    ],
    "html": "<section class=\"rf-card rf-stack\" data-rf-team-accept aria-labelledby=\"team-invitation-title\">\n  <div><p class=\"rf-eyebrow\">Good work starts together.</p><h3 id=\"team-invitation-title\">Join <span data-rf-invite-team>Studio</span></h3><p class=\"rf-muted\">You were invited as <strong data-rf-invite-role>Viewer</strong>.</p></div>\n  <form class=\"rf-stack\" method=\"dialog\" data-rf-invite-accept-form>\n    <label class=\"rf-field\"><span class=\"rf-label\">Invited email</span><input class=\"rf-input\" type=\"email\" name=\"email\" value=\"avery@example.com\" readonly></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Your display name</span><input class=\"rf-input\" name=\"name\" maxlength=\"80\" autocomplete=\"name\" required></label>\n    <p class=\"rf-alert\" data-variant=\"danger\" role=\"alert\" data-rf-invite-error hidden></p>\n    <button class=\"rf-button\" type=\"submit\" data-rf-invite-join>Join sample workspace</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Clear display name</button>\n  </form>\n  <p class=\"rf-help\" role=\"status\" data-rf-invite-status></p><p class=\"rf-help\" data-rf-invite-note>This gallery previews joining a page-session sample. No account is created. Real invitation links must be validated by your application server.</p>\n</section>",
    "cssBytes": 6334
  },
  {
    "id": "permissions-matrix",
    "title": "Permissions matrix",
    "category": "Components",
    "description": "Explain owner, admin, editor and viewer access in a readable native table.",
    "css": [
      "table",
      "alert"
    ],
    "js": [],
    "file": "examples/components/permissions-matrix.html",
    "notes": [
      "Column and row headers expose exact permissions without color or icons. The surrounding region scrolls independently on narrow screens.",
      "These rules cover team management. Applications authorize project, file and billing actions on their own server.",
      "Disabled controls help explain a role. The localhost team service separately checks current membership, privilege changes and last-owner protection for direct HTTP requests."
    ],
    "html": "<section class=\"rf-stack\" aria-labelledby=\"permissions-title\">\n  <div><p class=\"rf-eyebrow\">Clear roles. Fewer surprises.</p><h3 id=\"permissions-title\">Who can do what?</h3><p class=\"rf-muted\">These team rules are shared by the optional UI and the local server policy. Applications enforce their project, file and billing permissions separately.</p></div>\n  <div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Role permissions\"><table class=\"rf-table\"><caption>Team management permissions by role</caption><thead><tr><th scope=\"col\">Action</th><th scope=\"col\">Owner</th><th scope=\"col\">Admin</th><th scope=\"col\">Editor</th><th scope=\"col\">Viewer</th></tr></thead><tbody>\n    <tr><th scope=\"row\">Read the member list</th><td>Allowed</td><td>Allowed</td><td>Allowed</td><td>Allowed</td></tr>\n    <tr><th scope=\"row\">Invite editors and viewers</th><td>Allowed</td><td>Allowed</td><td>Not allowed</td><td>Not allowed</td></tr>\n    <tr><th scope=\"row\">Change or remove editors/viewers</th><td>Allowed</td><td>Allowed</td><td>Not allowed</td><td>Not allowed</td></tr>\n    <tr><th scope=\"row\">Manage owners and admins</th><td>Allowed</td><td>Not allowed</td><td>Not allowed</td><td>Not allowed</td></tr>\n    <tr><th scope=\"row\">Leave your own membership</th><td>Another owner required</td><td>Allowed</td><td>Allowed</td><td>Allowed</td></tr>\n    <tr><th scope=\"row\">Remove or demote the last owner</th><td>Not allowed</td><td>Not allowed</td><td>Not allowed</td><td>Not allowed</td></tr>\n  </tbody></table></div>\n  <div class=\"rf-alert\" data-variant=\"info\"><div><strong>Enforce access on the server.</strong><p>Disabled buttons explain permissions; the server checks the caller's current membership, requested role and workspace revision. An invitation link grants its configured access to its holder. Real accounts and email verification belong to the application.</p></div></div>\n</section>",
    "cssBytes": 1387
  },
  {
    "id": "rich-text-editor",
    "title": "Rich-text editor",
    "category": "Components",
    "description": "A native note editor with formatting, validated links, safe paste and a real HTML form value.",
    "css": [
      "card",
      "form",
      "button",
      "dialog",
      "editors"
    ],
    "js": [
      "editors"
    ],
    "file": "examples/components/rich-text-editor.html",
    "notes": [
      "Native browser editing commands preserve the undo history. execCommand is deprecated and browser behavior varies; unsupported toolbar actions are disabled. Native keyboard undo/redo remains available. Without the module the named HTML textarea stays usable.",
      "The restricted renderer reconstructs paragraphs, headings, lists, quotes, code, links and emphasis. Pasted scripts, images/media, forms, foreign namespaces, event attributes and arbitrary styles are removed. Links allow absolute HTTP, HTTPS and mailto URLs without controls or credentials.",
      "The form submits sanitized HTML, not the visible editing surface. Limits are 50,000 HTML and 20,000 text characters, 10,000 traversed nodes and 30 nested levels. Required validation focuses the visible editor. Reset follows native defaults and honors cancellation; input waits for IME composition to finish.",
      "Run initEditors(root) once and call its returned cleanup before removing the root. Dispatch change after assigning the source textarea programmatically. The application handles submit, authorization, persistence and server-side sanitization; this module sends no requests."
    ],
    "html": "<section class=\"rf-card rf-stack rf-editor\" data-rf-rich-editor>\n  <div><h3>Give an idea a little shape.</h3><p class=\"rf-muted\">Write a note, add emphasis, and keep the useful links close.</p></div>\n  <form class=\"rf-stack\" method=\"dialog\" data-demo-form>\n    <label class=\"rf-field\" data-rf-editor-source-field><span class=\"rf-label\">Rich-text note HTML</span><textarea class=\"rf-textarea rf-editor-source\" name=\"note\" data-rf-editor-source maxlength=\"50000\" required rows=\"8\">&lt;p&gt;Make room for &lt;strong&gt;your next idea&lt;/strong&gt;.&lt;/p&gt;&lt;p&gt;Start small. Share something useful.&lt;/p&gt;</textarea></label>\n    <div class=\"rf-stack\" data-rf-editor-enhanced hidden>\n      <span class=\"rf-label\" data-rf-editor-label>Rich-text note</span>\n      <div class=\"rf-editor-toolbar\" data-rf-editor-toolbar role=\"group\" aria-label=\"Rich-text formatting\">\n        <label class=\"rf-field\"><span class=\"rf-label\">Paragraph style</span><select class=\"rf-select\"><option value=\"p\">Paragraph</option><option value=\"h2\">Heading</option><option value=\"h3\">Subheading</option><option value=\"blockquote\">Quote</option><option value=\"pre\">Code block</option></select></label>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"bold\" aria-pressed=\"false\">Bold</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"italic\" aria-pressed=\"false\">Italic</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"underline\" aria-pressed=\"false\">Underline</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"insertUnorderedList\">Bullet list</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"insertOrderedList\">Numbered list</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-editor-link>Add link</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"unlink\">Remove link</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"undo\">Undo</button>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-rich-command=\"redo\">Redo</button>\n      </div>\n      <div class=\"rf-input rf-editor-canvas rf-editor-content\" data-rf-rich-surface role=\"textbox\" aria-multiline=\"true\" tabindex=\"0\"></div>\n    </div>\n    <p class=\"rf-help\" data-rf-editor-count></p><p class=\"rf-error\" data-rf-editor-error role=\"alert\" hidden></p>\n    <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Preview note</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset note</button></div>\n  </form>\n  <dialog class=\"rf-dialog\" data-rf-editor-link-dialog><h4 class=\"rf-dialog__title\">Add a useful link.</h4><form class=\"rf-stack\" method=\"dialog\"><label class=\"rf-field\"><span class=\"rf-label\">Link URL</span><input class=\"rf-input\" name=\"url\" type=\"text\" inputmode=\"url\" maxlength=\"2048\" placeholder=\"https://example.com\" required></label><p class=\"rf-error\" data-rf-editor-link-error role=\"alert\" hidden></p><div class=\"rf-dialog__actions\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-editor-link-cancel>Cancel link</button><button class=\"rf-button\" type=\"submit\">Insert link</button></div></form></dialog>\n</section>",
    "cssBytes": 7674
  },
  {
    "id": "markdown-editor",
    "title": "Markdown editor",
    "category": "Components",
    "description": "Write a note with keyboard formatting and a safe, readable Markdown preview.",
    "css": [
      "card",
      "form",
      "button",
      "dialog",
      "table",
      "editors"
    ],
    "js": [
      "editors"
    ],
    "file": "examples/components/markdown-editor.html",
    "notes": [
      "The named native textarea is the form value. Toolbar actions wrap the selection or prefix whole lines; Ctrl/Cmd B, I and K apply bold, italic and a validated link. Native insertion preserves undo where supported; the selection replacement fallback cannot promise undo history.",
      "The explicit subset supports headings, paragraphs, emphasis, strike, inline/fenced code, absolute safe links, quotes, flat lists/task markers, rules and pipe tables. It does not claim CommonMark/GFM compatibility, nested lists or syntax highlighting. Raw HTML and image syntax remain text; preview never loads an image.",
      "Preview is built from DOM text and allowlisted elements, not Markdown-derived HTML. Links open a new tab with noopener/noreferrer. Limits are 20,000 source characters, 10,000 inline tokens and 12 inline nesting levels; a failed render retains the previous preview.",
      "Reset and external value changes replace the native textarea to discard previous undo history. Read the current named field with FormData/form.elements and delegate listeners to the root or rf:editor-change. Read-only/disabled fields, composition and cleanup are supported. The dashboard keeps separate page-session notes; saving and server validation belong to the application. Scripts-off keeps a usable textarea."
    ],
    "html": "<section class=\"rf-card rf-stack rf-editor\" data-rf-markdown-editor data-demo-navigation>\n  <div><h3>A good thought, kept simple.</h3><p class=\"rf-muted\">Write Markdown and see your note take shape.</p></div>\n  <form class=\"rf-stack\" method=\"dialog\" data-demo-form>\n    <div class=\"rf-editor-toolbar\" data-rf-editor-toolbar role=\"group\" aria-label=\"Markdown formatting\" hidden>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"bold\">Bold</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"italic\">Italic</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"heading\">Heading</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"list\">Bullet list</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"quote\">Quote</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"code\">Inline code</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"fence\">Code block</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-markdown-action=\"link\">Add link</button>\n    </div>\n    <label class=\"rf-field\"><span class=\"rf-label\">Markdown note</span><textarea class=\"rf-textarea rf-editor-source\" name=\"notes\" data-rf-editor-source maxlength=\"20000\" required rows=\"9\">### Your next chapter\n\nMake room for **a good idea**.\n\n- [x] Start small\n- [ ] Share something useful\n\n[Explore Rofin](https://rofin-ui.vercel.app/)</textarea></label>\n    <p class=\"rf-help\" data-rf-editor-count></p><p class=\"rf-error\" data-rf-editor-error role=\"alert\" hidden></p>\n    <div><h4>Preview</h4><div class=\"rf-editor-content\" data-rf-markdown-preview><p class=\"rf-help\">A live preview appears when the editor is enabled.</p></div></div>\n    <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Preview note</button><button class=\"rf-button rf-button--outline\" type=\"reset\">Reset note</button></div>\n  </form>\n  <dialog class=\"rf-dialog\" data-rf-editor-link-dialog><h4 class=\"rf-dialog__title\">Add a useful link.</h4><form class=\"rf-stack\" method=\"dialog\"><label class=\"rf-field\"><span class=\"rf-label\">Link URL</span><input class=\"rf-input\" name=\"url\" type=\"text\" inputmode=\"url\" maxlength=\"2048\" placeholder=\"https://example.com\" required></label><p class=\"rf-error\" data-rf-editor-link-error role=\"alert\" hidden></p><div class=\"rf-dialog__actions\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-editor-link-cancel>Cancel link</button><button class=\"rf-button\" type=\"submit\">Insert link</button></div></form></dialog>\n</section>",
    "cssBytes": 8337
  },
  {
    "id": "file-browser",
    "title": "File browser",
    "category": "Components",
    "description": "Find a file, organize a folder, and keep the bytes intact.",
    "css": [
      "card",
      "form",
      "button",
      "dialog",
      "upload",
      "file-browser"
    ],
    "js": [
      "file-browser"
    ],
    "file": "examples/components/file-browser.html",
    "notes": [
      "Arrow keys explore the single-select tree. Right opens a folder or enters its children; Left closes it or returns to its parent. Home/End and typeahead find visible items. Focus selects an item without downloading it; Enter toggles a folder. Folder icons, native selects and buttons provide pointer/touch alternatives.",
      "Import actual files or a folder where the native directory chooser is supported. Paths are preserved. New text files, rename, move, exact-byte downloads and recoverable Trash act on browser copies; original disk files are untouched. Names remain reserved while in Trash. Search includes matching paths and their ancestors.",
      "Limits include recoverable Trash: 200 items, 8 MB per file, 32 MB total, 12 levels and 120 characters per name. Imports are atomic; invalid paths, cycles, duplicate names and oversized files leave existing entries intact. New text files allow 20,000 characters. Files are never rendered as HTML or loaded automatically.",
      "createFileBrowser(root, { entries, onChange }) accepts actual File objects. onChange receives copied next entries, an operation and an AbortSignal before a change commits; rejection keeps the current entries and dialog draft. Cancel or teardown aborts pending callbacks and ignores late completion. Your server owns validation, authorization and durable storage; this module sends no requests.",
      "getEntries() includes recoverable Trash and actual Files; retain it before destroy() or unmounting. rf:file-change emits copied entries and the operation; rf:file-select emits the selected entry. data-rf-readonly blocks mutations, aria-disabled blocks all actions. Initialize once; teardown restores the original readable details/download fallback, not later session data.",
      "The composed dashboard uses this exact component with separate page-session files for each public workspace. Reload restores samples. The scripts-off sample keeps native expandable folders and plain-text downloads; custom application data requires supplied File entries."
    ],
    "html": "<section class=\"rf-card rf-stack rf-file-browser\" data-rf-file-browser data-demo-navigation>\n  <div><h3>A little room for your files.</h3><p class=\"rf-muted\">Organize a browser copy. Download files to keep them; reload restores the sample.</p></div>\n  <p class=\"rf-help\">Original disk files stay intact. No files are uploaded. Up to 200 items, 8 MB per file, 32 MB total and 12 levels, including recoverable Trash.</p>\n  <ul class=\"rf-file-fallback\" data-rf-file-fallback>\n    <li><details><summary>Ideas</summary><ul><li><a href=\"data:text/plain;charset=utf-8,Make%20room%20for%20a%20good%20idea.%0A\" download=\"Roadmap.txt\">Roadmap.txt</a></li><li><details><summary>Research</summary><ul><li><a href=\"data:text/plain;charset=utf-8,Start%20with%20the%20people%20using%20it.%0A\" download=\"Notes.txt\">Notes.txt</a></li></ul></details></li></ul></details></li>\n    <li><a href=\"data:text/plain;charset=utf-8,Made%20with%20Rofin%20UI.%0A\" download=\"Readme.txt\">Readme.txt</a></li>\n  </ul>\n  <div class=\"rf-stack\" data-rf-file-enhanced hidden>\n    <div class=\"rf-file-inputs rf-upload\">\n      <label class=\"rf-field\"><span class=\"rf-label\">Project files</span><input type=\"file\" multiple data-rf-file-import></label>\n      <label class=\"rf-field\"><span class=\"rf-label\">Import folder</span><input type=\"file\" multiple webkitdirectory data-rf-folder-import></label>\n    </div>\n    <p class=\"rf-help\">Imports go into the selected folder, or beside the selected file. Folder import preserves paths where the browser supports it.</p>\n    <div class=\"rf-file-toolbar\" role=\"group\" aria-label=\"File actions\">\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"folder\">New folder</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"file\">New text file</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"rename\">Rename item</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"move\">Move item</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"download\">Download file</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"trash\">Trash item</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-action=\"restore\">Restore trash</button>\n      <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-file-cancel-pending hidden>Cancel pending file change</button>\n    </div>\n    <label class=\"rf-field\"><span class=\"rf-label\">Search files and folders</span><input class=\"rf-input\" type=\"search\" maxlength=\"200\" data-rf-file-search></label>\n    <p class=\"rf-error\" role=\"alert\" data-rf-file-error hidden></p>\n    <ul class=\"rf-file-tree\" role=\"tree\" aria-label=\"Files and folders\" data-rf-file-tree></ul>\n    <p class=\"rf-help\" data-rf-file-empty hidden></p>\n    <div class=\"rf-file-details\" data-rf-file-details></div>\n    <p class=\"rf-help\" role=\"status\" data-rf-file-status></p>\n    <dialog class=\"rf-dialog\" data-rf-file-dialog>\n      <h4 class=\"rf-dialog__title\">Change a file.</h4><p class=\"rf-help\" data-rf-file-dialog-note></p>\n      <form class=\"rf-stack\" method=\"dialog\">\n        <fieldset class=\"rf-stack\"><label class=\"rf-field\"><span class=\"rf-label\">Item name</span><input class=\"rf-input\" name=\"name\" maxlength=\"120\"></label><label class=\"rf-field\"><span class=\"rf-label\">Text contents</span><textarea class=\"rf-textarea\" name=\"contents\" maxlength=\"20000\" rows=\"6\"></textarea></label><label class=\"rf-field\"><span class=\"rf-label\">Destination folder</span><select class=\"rf-select\" name=\"destination\"><option value=\"\">Top level</option></select></label></fieldset>\n        <p class=\"rf-error\" role=\"alert\" data-rf-file-dialog-error hidden></p>\n        <div class=\"rf-dialog__actions\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-file-cancel>Cancel file change</button><button class=\"rf-button\" type=\"submit\">Save file change</button></div>\n      </form>\n    </dialog>\n  </div>\n</section>",
    "cssBytes": 8647
  },
  {
    "id": "image-lightbox",
    "title": "Image lightbox",
    "category": "Components",
    "description": "Open a full image, explore its neighbors and return to where you started.",
    "css": [
      "button",
      "dialog",
      "viewers"
    ],
    "js": [
      "viewers"
    ],
    "file": "examples/components/image-lightbox.html",
    "assets": [
      "examples/assets/dawn.svg",
      "examples/assets/orbit.svg",
      "examples/assets/studio.svg"
    ],
    "notes": [
      "Native image links remain useful without scripts. The optional lightbox uses a labelled native dialog, Left/Right, Home/End, Previous/Next and Escape; focus returns to the opening link. Navigation stops at the first/last image and never autoplays.",
      "Use 1–100 links with meaningful image alt text and captions. Normal opens accept HTTP/HTTPS URLs without credentials or control characters; explicit image opens load the original. Failed images show an original-file link and useful feedback. Modified clicks retain native link behavior.",
      "Call initViewers(root) once and its returned cleanup before unmounting. createLightbox(root) reuses an existing instance; destroy closes and clears the viewer. aria-disabled on the root blocks new opens/navigation. rf:lightbox-change exposes the zero-based index and URL.",
      "Copy the original sample assets and adjust their relative paths for your application. These simple SVG illustrations are original Rofin assets under MIT, with no external image service."
    ],
    "html": "<section class=\"rf-stack\" data-rf-lightbox data-demo-navigation>\n  <div><h3>Three ways to see a new idea.</h3><p class=\"rf-muted\">Open an image, then use Left/Right or Previous/Next to explore. Without scripts, each link opens the original.</p></div>\n  <div class=\"rf-lightbox-grid\">\n    <a class=\"rf-lightbox-link\" href=\"../assets/dawn.svg\" data-rf-lightbox-item><figure><img src=\"../assets/dawn.svg\" width=\"960\" height=\"540\" alt=\"A warm sun rises behind green hills beside a quiet window.\"><figcaption>A little room for the morning.</figcaption></figure></a>\n    <a class=\"rf-lightbox-link\" href=\"../assets/orbit.svg\" data-rf-lightbox-item><figure><img src=\"../assets/orbit.svg\" width=\"960\" height=\"540\" alt=\"A lavender planet, pale orbit and golden moon against a dark sky.\"><figcaption>A wider world of possibility.</figcaption></figure></a>\n    <a class=\"rf-lightbox-link\" href=\"../assets/studio.svg\" data-rf-lightbox-item><figure><img src=\"../assets/studio.svg\" width=\"960\" height=\"540\" alt=\"A calm workspace arranged in green, lavender and sand-colored panels.\"><figcaption>A few useful pieces, together.</figcaption></figure></a>\n  </div>\n  <p class=\"rf-error\" role=\"alert\" data-rf-lightbox-error hidden></p>\n  <dialog class=\"rf-dialog rf-viewer-dialog rf-stack\" aria-label=\"Project image viewer\" data-rf-lightbox-dialog>\n    <div class=\"rf-viewer-head\"><h3>Another perspective.</h3><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-viewer-close>Close image viewer</button></div>\n    <div class=\"rf-lightbox-stage\" data-rf-lightbox-stage></div>\n    <p data-rf-lightbox-caption></p><p class=\"rf-help\" role=\"status\" data-rf-lightbox-status></p>\n    <div class=\"rf-viewer-actions\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-lightbox-prev>Previous image</button><a class=\"rf-button rf-button--outline\" data-rf-lightbox-original target=\"_blank\" rel=\"noopener noreferrer\">Open original image</a><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-lightbox-next>Next image</button></div>\n  </dialog>\n</section>",
    "cssBytes": 3958
  },
  {
    "id": "document-viewer",
    "title": "Document viewer",
    "category": "Components",
    "description": "Read a project brief, download the PDF or preview a local file.",
    "css": [
      "card",
      "form",
      "button",
      "dialog",
      "viewers"
    ],
    "js": [
      "viewers"
    ],
    "file": "examples/components/document-viewer.html",
    "assets": [
      "examples/assets/project-brief.pdf"
    ],
    "notes": [
      "The native PDF object uses the browser’s own reader where available. Page/zoom controls and plugin support vary; a PDF download and complete HTML text alternative stay available without scripts. This is not a PDF rendering/editor engine.",
      "The optional local-file chooser previews supported raster images, PDF, plain text and native audio/video in a dialog. File bytes never leave the browser. Active HTML/SVG documents are rejected, PDF headers are checked, names are bounded and files are limited to 8 MB. Actual decoding still belongs to the browser.",
      "createFileViewer(root).open(file) accepts an actual File and returns a promise resolving to whether it opened. Plain text is rendered through textContent, with a 64 KB preview limit; Download preserves the complete original bytes. Declared supported formats that fail decoding retain the download.",
      "Close/Escape and destroy pause media, release blob URLs and discard stale reads. Reinitialization restores the chooser. The local-media preview has no supplied captions/transcript; applications provide their content alternatives, as the separate media example demonstrates.",
      "The dashboard uses the same viewer for its selected browser-copy files. Workspace changes close previews, pause sample media and clear the selected file. Sample documents/images/media are shared references, not workspace data or authorized storage."
    ],
    "html": "<section class=\"rf-card rf-stack rf-document\" data-rf-file-viewer data-demo-navigation>\n  <div><h3>A small project, thoughtfully made.</h3><p class=\"rf-muted\">A two-page project brief, with a readable text alternative and a PDF download.</p></div>\n  <details><summary>Read the project brief as text</summary><div class=\"rf-stack\">\n    <h4>Make room for a good idea.</h4><p><strong>The idea:</strong> Build a useful workspace from small, reusable pieces.</p><p><strong>The people:</strong> Make it readable, keyboard friendly and comfortable on a phone.</p><p><strong>The shape:</strong> Start with a clear task, a short form and helpful feedback.</p>\n    <h4>Give the details a little care.</h4><p><strong>Before sharing:</strong> Check navigation, forms, errors and actual file downloads.</p><p><strong>When it moves:</strong> Let people choose when media plays. Keep text alternatives.</p><p><strong>What stays:</strong> A product supplies its own accounts, services and durable data.</p>\n  </div></details>\n  <details><summary>View the PDF in this browser</summary><object data=\"../assets/project-brief.pdf\" type=\"application/pdf\" aria-label=\"Two-page project brief\"><p>Your browser may not embed PDFs. Download the brief below or read its text alternative above.</p></object></details>\n  <div class=\"rf-cluster\"><a class=\"rf-button rf-button--outline\" href=\"../assets/project-brief.pdf\" download=\"project-brief.pdf\">Download project brief (PDF)</a><a href=\"../assets/project-brief.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">Open PDF in a new tab</a></div>\n  <label class=\"rf-field\" data-rf-file-viewer-field hidden><span class=\"rf-label\">Preview your own file</span><input type=\"file\" accept=\"image/png,image/jpeg,image/gif,image/webp,image/avif,application/pdf,text/plain,audio/wav,audio/x-wav,audio/mpeg,audio/ogg,video/mp4,video/webm,video/ogg,.txt,.pdf,.wav\" data-rf-file-viewer-input></label>\n  <p class=\"rf-help\">Local previews stay in this browser. Choose a supported image, PDF, plain text, audio or video file up to 8 MB. Original files stay intact.</p>\n  <p class=\"rf-error\" role=\"alert\" data-rf-file-viewer-error hidden></p>\n  <dialog class=\"rf-dialog rf-viewer-dialog rf-stack\" aria-label=\"Local file preview\" data-rf-file-viewer-dialog>\n    <div class=\"rf-viewer-head\"><h4 data-rf-file-viewer-title>File preview</h4><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-viewer-close>Close file preview</button></div>\n    <div class=\"rf-file-preview\" data-rf-file-viewer-body></div><p class=\"rf-help\" role=\"status\" data-rf-file-viewer-status></p>\n    <a class=\"rf-button rf-button--outline\" data-rf-file-viewer-download>Download opened file</a>\n  </dialog>\n</section>",
    "cssBytes": 7944
  },
  {
    "id": "media-player",
    "title": "Media player",
    "category": "Components",
    "description": "Native video and audio controls, captions, text alternatives and real downloads.",
    "css": [
      "card",
      "button",
      "viewers"
    ],
    "js": [
      "viewers"
    ],
    "file": "examples/components/media-player.html",
    "assets": [
      "examples/assets/small-momentum.mp4",
      "examples/assets/small-momentum.webm",
      "examples/assets/small-momentum.vtt",
      "examples/assets/three-notes.wav"
    ],
    "notes": [
      "Playback uses native audio/video controls and starts only when the person chooses it. The original three-second clip offers MP4 and WebM sources; codec support varies, and download/text alternatives remain available.",
      "The video has a native WebVTT description track and a visible description. The audio has a complete text alternative. Caption control labels, seeking and fullscreen behavior are owned by the browser; no custom fake playback timer is used.",
      "With initViewers(root), starting one sample player pauses the other, decoder failures expose feedback, and teardown pauses media. With scripts disabled, native playback and downloadable files still work.",
      "Copy the original local assets and replace the descriptions/captions when supplying your own media. No remote media service, autoplay, analytics or runtime dependency is required."
    ],
    "html": "<section class=\"rf-card rf-stack rf-media-player\" data-rf-media data-demo-navigation>\n  <div><h3>A little momentum.</h3><p class=\"rf-muted\">A three-second original animation and three quiet notes. Playback starts when you choose it.</p></div>\n  <figure><video controls playsinline preload=\"none\" width=\"640\" height=\"360\" aria-label=\"Small momentum animation\"><source src=\"../assets/small-momentum.webm\" type=\"video/webm\"><source src=\"../assets/small-momentum.mp4\" type=\"video/mp4\"><track src=\"../assets/small-momentum.vtt\" kind=\"captions\" srclang=\"en\" label=\"English descriptions\" default><p>Use the video download below if playback is unavailable.</p></video><figcaption>A golden dot visits three cards as a lavender progress bar fills. Three soft notes accompany it; there is no speech.</figcaption></figure>\n  <details><summary>Read the video text alternative</summary><p>Over three seconds, a golden dot travels from left to right across three dark cards, gently rising and falling. A lavender bar fills beneath them. Three soft musical notes sound in sequence. No information is conveyed only through speech.</p></details>\n  <div class=\"rf-cluster\"><a href=\"../assets/small-momentum.mp4\" download=\"small-momentum.mp4\">Download MP4 video</a><a href=\"../assets/small-momentum.webm\" download=\"small-momentum.webm\">Download WebM video</a><a href=\"../assets/small-momentum.vtt\" download=\"small-momentum.vtt\">Download video captions</a></div>\n  <figure><audio controls preload=\"none\" aria-label=\"Three quiet notes\"><source src=\"../assets/three-notes.wav\" type=\"audio/wav\"><p>Use the audio download below if playback is unavailable.</p></audio><figcaption>Three quiet notes, played one after another, fading gently. There is no speech.</figcaption></figure>\n  <details><summary>Read the audio text alternative</summary><p>A C note sounds at 0.2 seconds, an E at 1 second and a G at 1.8 seconds. Each fades gently. The clip lasts three seconds and contains no speech.</p></details>\n  <a href=\"../assets/three-notes.wav\" download=\"three-notes.wav\">Download WAV audio</a><p class=\"rf-help\" role=\"status\" data-rf-media-status></p>\n</section>",
    "cssBytes": 4039
  },
  {
    "id": "error-404",
    "title": "404 page",
    "category": "Sections",
    "description": "A useful next step when a page or resource cannot be found.",
    "css": [
      "empty-state",
      "button"
    ],
    "js": [],
    "file": "sections/error-404.html",
    "notes": [
      "This section composes Rofin empty-state, button and layout styles. Native links stay usable without JavaScript. Customize account/team links for your application; the public dashboard has no authenticated account.",
      "The composed examples/recovery.html page uses these exact sections after actual HTTP or offline failures. Its retry buttons reload only a GET resource; requests are abortable, bounded to eight seconds, and late results are ignored. The native note stays in the page, not in durable storage.",
      "HTML alone cannot enforce permissions, cache an offline shell, or confirm whether a failed write completed. Your server owns authorization and error status codes. Use a safe read to reconcile before retrying mutations.",
      "The static build emits native 404.html, 403.html, offline.html and 500.html pages. Vercel serves the custom 404 for missing static paths; an unknown documentation hash also uses the same 404 section. A first visit offline needs application caching; this sample does not install a service worker."
    ],
    "html": "<section class=\"rf-empty rf-error-page\" data-rf-recovery-state=\"missing\">\n  <span class=\"rf-error-page__code\" aria-hidden=\"true\">404</span>\n  <h2 tabindex=\"-1\">This page took a different path.</h2>\n  <p>The page or resource could not be found. Check the address, or find something useful in the component gallery.</p>\n  <div class=\"rf-cluster\">\n    <a class=\"rf-button\" href=\"../docs/index.html#catalog\">Explore components</a>\n    <a class=\"rf-button rf-button--outline\" href=\"../examples/dashboard.html\">Open dashboard</a>\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-recovery-retry hidden>Try again</button>\n  </div>\n</section>",
    "cssBytes": 2347
  },
  {
    "id": "error-permission",
    "title": "Permission page",
    "category": "Sections",
    "description": "Clear access guidance with a real team destination and a read-only retry.",
    "css": [
      "empty-state",
      "button"
    ],
    "js": [],
    "file": "sections/error-permission.html",
    "notes": [
      "This section composes Rofin empty-state, button and layout styles. Native links stay usable without JavaScript. Customize account/team links for your application; the public dashboard has no authenticated account.",
      "The composed examples/recovery.html page uses these exact sections after actual HTTP or offline failures. Its retry buttons reload only a GET resource; requests are abortable, bounded to eight seconds, and late results are ignored. The native note stays in the page, not in durable storage.",
      "HTML alone cannot enforce permissions, cache an offline shell, or confirm whether a failed write completed. Your server owns authorization and error status codes. Use a safe read to reconcile before retrying mutations.",
      "The static build emits native 404.html, 403.html, offline.html and 500.html pages. Vercel serves the custom 404 for missing static paths; an unknown documentation hash also uses the same 404 section. A first visit offline needs application caching; this sample does not install a service worker."
    ],
    "html": "<section class=\"rf-empty rf-error-page\" data-rf-recovery-state=\"permission\">\n  <span class=\"rf-error-page__code\" aria-hidden=\"true\">403</span>\n  <h2 tabindex=\"-1\">A little permission is needed.</h2>\n  <p>This resource is unavailable to your current account. Ask its owner for access, then try again. Your draft can stay right here.</p>\n  <div class=\"rf-cluster\">\n    <a class=\"rf-button\" href=\"../examples/dashboard.html#team\">Open workspace team</a>\n    <a class=\"rf-button rf-button--outline\" href=\"\" data-rf-recovery-reload>Check access again</a>\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-recovery-retry hidden>Check access again</button>\n  </div>\n  <small class=\"rf-help\">Access is decided by your application's server. Switching pages does not grant permission.</small>\n</section>",
    "cssBytes": 2347
  },
  {
    "id": "error-offline",
    "title": "Offline page",
    "category": "Sections",
    "description": "Keep an unsent draft in place while a resource reconnects.",
    "css": [
      "empty-state",
      "button"
    ],
    "js": [],
    "file": "sections/error-offline.html",
    "notes": [
      "This section composes Rofin empty-state, button and layout styles. Native links stay usable without JavaScript. Customize account/team links for your application; the public dashboard has no authenticated account.",
      "The composed examples/recovery.html page uses these exact sections after actual HTTP or offline failures. Its retry buttons reload only a GET resource; requests are abortable, bounded to eight seconds, and late results are ignored. The native note stays in the page, not in durable storage.",
      "HTML alone cannot enforce permissions, cache an offline shell, or confirm whether a failed write completed. Your server owns authorization and error status codes. Use a safe read to reconcile before retrying mutations.",
      "The static build emits native 404.html, 403.html, offline.html and 500.html pages. Vercel serves the custom 404 for missing static paths; an unknown documentation hash also uses the same 404 section. A first visit offline needs application caching; this sample does not install a service worker."
    ],
    "html": "<section class=\"rf-empty rf-error-page\" data-rf-recovery-state=\"offline\">\n  <span class=\"rf-error-page__code\" aria-hidden=\"true\">↗</span>\n  <h2 tabindex=\"-1\">A pause in the connection.</h2>\n  <p>Reconnect, then try loading this resource again. Leave this page open to keep your unsent draft.</p>\n  <div class=\"rf-cluster\">\n    <a class=\"rf-button\" href=\"\" data-rf-recovery-reload>Try again</a>\n    <button class=\"rf-button\" type=\"button\" data-rf-recovery-retry hidden>Try again</button>\n    <a class=\"rf-button rf-button--outline\" href=\"../docs/index.html#catalog\">Explore components</a>\n  </div>\n  <small class=\"rf-help\">Only content already loaded by your application is available offline.</small>\n</section>",
    "cssBytes": 2347
  },
  {
    "id": "error-server",
    "title": "Server-error page",
    "category": "Sections",
    "description": "A calm recovery page with a safe read-request retry.",
    "css": [
      "empty-state",
      "button"
    ],
    "js": [],
    "file": "sections/error-server.html",
    "notes": [
      "This section composes Rofin empty-state, button and layout styles. Native links stay usable without JavaScript. Customize account/team links for your application; the public dashboard has no authenticated account.",
      "The composed examples/recovery.html page uses these exact sections after actual HTTP or offline failures. Its retry buttons reload only a GET resource; requests are abortable, bounded to eight seconds, and late results are ignored. The native note stays in the page, not in durable storage.",
      "HTML alone cannot enforce permissions, cache an offline shell, or confirm whether a failed write completed. Your server owns authorization and error status codes. Use a safe read to reconcile before retrying mutations.",
      "The static build emits native 404.html, 403.html, offline.html and 500.html pages. Vercel serves the custom 404 for missing static paths; an unknown documentation hash also uses the same 404 section. A first visit offline needs application caching; this sample does not install a service worker."
    ],
    "html": "<section class=\"rf-empty rf-error-page\" data-rf-recovery-state=\"server\">\n  <span class=\"rf-error-page__code\" aria-hidden=\"true\">500</span>\n  <h2 tabindex=\"-1\">We couldn't bring this back yet.</h2>\n  <p>The resource could not be loaded. Wait a moment, then try again. Your unsent draft stays on this page.</p>\n  <div class=\"rf-cluster\">\n    <a class=\"rf-button\" href=\"\" data-rf-recovery-reload>Try again</a>\n    <button class=\"rf-button\" type=\"button\" data-rf-recovery-retry hidden>Try again</button>\n    <a class=\"rf-button rf-button--outline\" href=\"../examples/dashboard.html\">Open dashboard</a>\n  </div>\n  <small class=\"rf-help\">Retry a read request. Before retrying a failed save or payment, confirm whether it already completed.</small>\n</section>",
    "cssBytes": 2347
  },
  {
    "id": "subscription",
    "title": "Subscription management",
    "category": "Components",
    "description": "Review a plan, its full billing interval and scheduled cancellation.",
    "css": [
      "billing",
      "card",
      "form",
      "button",
      "table",
      "progress",
      "badge"
    ],
    "js": [
      "billing"
    ],
    "file": "examples/components/subscription.html",
    "notes": [
      "Native plan/interval fields and a review dialog reuse Rofin form, card and button components. Sample changes and cancellation remain within the page session; no payment details or real charges are collected. Pass sample: true for fictional snapshots; production callbacks show provider-owned confirmation wording.",
      "createBillingManager(element, { snapshot, change, load }) renders copied, validated application state. change(operation, {signal, revision}) must return a newer confirmed snapshot for the same workspace. Eight-second timeout, failed or invalid confirmations retain prior data and require an explicit refresh before another change; teardown aborts callbacks and ignores late results.",
      "Your authorized server/provider owns prices, proration, entitlements, idempotency, invoice/payment verification and cancellation policy. Never infer a paid subscription from a checkout redirect. Configure real checkout/portal services in the application; none is connected in this example."
    ],
    "html": "<section class=\"rf-stack\" data-rf-billing-demo>\n  <div><p class=\"rf-eyebrow\">Room to grow, on your terms.</p><h3>Subscription management</h3><p class=\"rf-muted\" data-rf-billing-name>Studio</p><p class=\"rf-help\" data-rf-billing-sample-note>Fictional page-session sample. No charges, payment details or real subscription changes.</p></div>\n  <article class=\"rf-card rf-stack\"><h4 class=\"rf-card__title\" data-rf-subscription-current>Studio · $19.00 / month</h4><p class=\"rf-help\" data-rf-billing-period>Current period: 2026-10-01 through 2026-11-01 (end exclusive).</p><p data-rf-subscription-state>No cancellation scheduled.</p><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-billing-action=\"cancel\" disabled>Schedule cancellation</button></article>\n  <form class=\"rf-stack\" data-rf-plan-form><fieldset class=\"rf-segmented\"><legend>Plan interval</legend><label><input type=\"radio\" name=\"interval\" value=\"monthly\" checked disabled><span>Monthly</span></label><label><input type=\"radio\" name=\"interval\" value=\"yearly\" disabled><span>Yearly</span></label></fieldset><div class=\"rf-grid rf-billing-plans\" data-rf-plan-cards><article class=\"rf-card\"><h4 class=\"rf-card__title\">Personal</h4><p>$0.00 / month · 3 projects · 1 seat</p></article><article class=\"rf-card\"><h4 class=\"rf-card__title\">Studio</h4><p>$19.00 / month · 30 projects · 5 seats</p></article><article class=\"rf-card\"><h4 class=\"rf-card__title\">Organization</h4><p>$49.00 / month · unlimited projects · 20 seats</p></article></div><label class=\"rf-field\"><span class=\"rf-label\">Requested plan</span><select class=\"rf-select\" name=\"plan\" disabled><option value=\"personal\">Personal</option><option value=\"studio\" selected>Studio</option><option value=\"organization\">Organization</option></select></label><div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\" disabled>Review plan change</button><button class=\"rf-button rf-button--outline\" type=\"reset\" disabled>Reset selection</button></div></form>\n  <p class=\"rf-alert\" data-variant=\"danger\" data-rf-billing-error role=\"alert\" hidden></p><p class=\"rf-help\" data-rf-billing-status role=\"status\"></p><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-billing-refresh disabled>Refresh billing data</button>\n  <dialog class=\"rf-dialog\" data-rf-billing-confirm aria-label=\"Review subscription change\"><h4 class=\"rf-dialog__title\">Review subscription change</h4><p data-rf-billing-review></p><p class=\"rf-help\" data-rf-billing-sample-note>This preview changes the sample only. In a real product, your billing provider confirms charges, timing and any proration before payment.</p><p class=\"rf-help\" data-rf-billing-provider-note hidden>Your billing provider must confirm any charges, effective date and proration before payment.</p><p class=\"rf-alert\" data-variant=\"danger\" data-rf-billing-error role=\"alert\" hidden></p><div class=\"rf-dialog__actions\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-billing-dismiss autofocus>Keep current plan</button><button class=\"rf-button\" type=\"button\" data-rf-billing-apply disabled>Apply sample change</button></div></dialog>\n</section>",
    "cssBytes": 8009
  },
  {
    "id": "invoice-history",
    "title": "Invoice history",
    "category": "Components",
    "description": "Find invoices, reconcile exact amounts and download their records.",
    "css": [
      "billing",
      "card",
      "form",
      "button",
      "table",
      "progress",
      "badge"
    ],
    "js": [
      "billing"
    ],
    "file": "examples/components/invoice-history.html",
    "notes": [
      "Native details preserve exact line items, discounts, tax, paid and outstanding totals. Search/status fields filter the same records. Text downloads contain actual accepted invoice data; fictional samples identify themselves and do not claim to be tax documents or payment receipts.",
      "Billing snapshots use integer minor units and an explicit currency display exponent. Safe-integer amounts and reconciled invoice totals are validated atomically. Voided records have no outstanding balance, and each invoice retains its original customer name.",
      "One workspace currency, up to 100 invoices with 30 items each. Applications paginate larger ledgers and supply provider invoice/PDF records. The component makes no requests. Without scripts, the example still expands and downloads its included sample invoice."
    ],
    "html": "<section class=\"rf-stack\" data-rf-billing-demo>\n  <div><p class=\"rf-eyebrow\">Every amount, accounted for.</p><h3>Invoice history</h3><p class=\"rf-muted\" data-rf-billing-name>Studio</p><p class=\"rf-help\" data-rf-billing-sample-note>Fictional records. These text downloads are sample statements, not tax documents or proof of payment.</p></div>\n  <div class=\"rf-cluster\"><label class=\"rf-field\"><span class=\"rf-label\">Search invoices</span><input class=\"rf-input\" type=\"search\" maxlength=\"100\" data-rf-invoice-search disabled></label><label class=\"rf-field\"><span class=\"rf-label\">Invoice status</span><select class=\"rf-select\" data-rf-invoice-filter disabled><option value=\"\">All statuses</option><option value=\"paid\">Paid</option><option value=\"open\">Open</option><option value=\"void\">Void</option></select></label></div>\n  <div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Invoice records\"><table class=\"rf-table\"><caption>Expand an invoice for its exact line items and totals</caption><thead><tr><th scope=\"col\">Invoice</th><th scope=\"col\">Issued</th><th scope=\"col\">Total</th><th scope=\"col\">Status</th></tr></thead><tbody data-rf-invoice-rows><tr><th scope=\"row\"><details><summary>STUDIO-2026-09</summary><p>Studio plan · 1 × $19.00. Subtotal $19.00; discount $0.00; tax $1.90; total and paid $20.90; outstanding $0.00.</p><a href=\"../examples/assets/sample-invoice.txt\" download=\"sample-invoice.txt\">Download sample invoice text</a></details></th><td>2026-09-01</td><td>$20.90</td><td>paid</td></tr></tbody></table></div>\n  <p class=\"rf-help\" data-rf-invoice-empty hidden>No matching invoices.</p><p class=\"rf-alert\" data-variant=\"danger\" data-rf-billing-error role=\"alert\" hidden></p><p class=\"rf-help\" data-rf-billing-status role=\"status\"></p><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-billing-refresh disabled>Refresh billing data</button>\n</section>",
    "cssBytes": 8009
  },
  {
    "id": "usage",
    "title": "Usage and limits",
    "category": "Components",
    "description": "Understand exact capacity, remaining room and over-limit states.",
    "css": [
      "billing",
      "card",
      "form",
      "button",
      "table",
      "progress",
      "badge"
    ],
    "js": [
      "billing"
    ],
    "file": "examples/components/usage.html",
    "notes": [
      "Native meters and exact text show projects, seats and storage bytes with remaining, near-capacity, at-limit and over-capacity states. Unlimited and zero quotas are explicit; the displayed number is never hidden by a capped meter.",
      "The independent gallery selector previews normal, near, over and empty sample values. Dashboard usage derives from the active workspace's actual page-session projects, team members and browser-copy File sizes; previews are hidden there.",
      "Counts are current snapshots, not usage billing history. Applications supply authorized provider metrics and enforce entitlements on the server. No quota restriction or charge is enforced by this UI."
    ],
    "html": "<section class=\"rf-stack\" data-rf-billing-demo>\n  <div><p class=\"rf-eyebrow\">Know how much room you have.</p><h3>Usage and limits</h3><p class=\"rf-muted\" data-rf-billing-name>Studio</p><p class=\"rf-help\">Exact sample values and plan capacity. Counts are a current snapshot; they do not claim metered billing history.</p></div>\n  <div class=\"rf-grid rf-billing-usage\" data-rf-usage-values><article class=\"rf-card\"><h4 class=\"rf-card__title\">Projects</h4><p>6 of 30 projects. 24 remaining.</p></article><article class=\"rf-card\"><h4 class=\"rf-card__title\">Seats</h4><p>3 of 5 seats. 2 remaining.</p></article><article class=\"rf-card\"><h4 class=\"rf-card__title\">Storage bytes</h4><p>12,000,000 of 50,000,000 bytes. 38,000,000 remaining.</p></article></div>\n  <label class=\"rf-field\" data-rf-usage-preview><span class=\"rf-label\">Try sample usage</span><select class=\"rf-select\" data-rf-usage-scenario disabled><option value=\"normal\">Normal usage</option><option value=\"near\">Near capacity</option><option value=\"over\">Over capacity</option><option value=\"empty\">No usage yet</option></select></label>\n  <p class=\"rf-alert\" data-variant=\"danger\" data-rf-billing-error role=\"alert\" hidden></p><p class=\"rf-help\" data-rf-billing-status role=\"status\"></p><button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-billing-refresh disabled>Refresh billing data</button>\n</section>",
    "cssBytes": 8009
  },
  {
    "id": "prism-lab",
    "title": "Prism lab",
    "category": "Effects",
    "description": "Aim light through an original 3D prism, explore refraction and read exact ray data.",
    "css": [
      "card",
      "form",
      "button",
      "table",
      "prism"
    ],
    "js": [
      "prism"
    ],
    "file": "examples/components/prism-lab.html",
    "notes": [
      "Original generated geometry and WebGL shaders; no vendor code, remote assets or runtime dependencies. The bounded illustrative model uses seven wavelengths and up to eight internal reflections. It is not a calibrated material measurement.",
      "Native ranges adjust beam height/angle, refractive index, dispersion and scene turn/tilt. Canvas dragging adjusts beam height/angle; the native controls provide the same model changes without dragging. Spin starts only on request and any manual adjustment pauses it.",
      "Reduced motion disables spin. Forced colors or unavailable WebGL retain the static illustration and readable ray table; model controls still update the table when scripts work. Without scripts, exact default values and native disclosure remain available.",
      "Use initPrisms(root), then call its returned cleanup before removing the root. Cleanup releases GPU resources and pointer capture, cancels motion and leaves the last ray table readable. Reinitialization retains current native values. Offscreen/hidden/pagehide pauses never auto-resume; restored WebGL contexts restart paused.",
      "Opt-in spin targets 30 frames per second; manual changes redraw immediately. The backing buffer is limited to a 1.5 device-pixel ratio and 262144 pixels. Manual settings are finite and bounded; tracePrism(settings) returns copied model rays for application use. The illustrative index formula is index + dispersion * ((550 / wavelength) ** 2 - 1), using nanometers."
    ],
    "html": "<section class=\"rf-card rf-stack rf-prism\" data-rf-prism>\n  <div><p class=\"rf-eyebrow\">A little light. A different perspective.</p><h3>Prism lab</h3><p class=\"rf-muted\">Aim a beam through a 3D prism. Seven wavelengths bend by different amounts; some angles reflect internally. This is an illustrative dispersion model, not a calibrated material measurement.</p></div>\n  <figure><div class=\"rf-prism-stage\"><svg viewBox=\"0 0 600 300\" aria-hidden=\"true\" data-rf-prism-fallback><path d=\"M20 165H255M330 150L580 90M330 150L580 115M330 150L580 140M330 150L580 165M330 150L580 190M330 150L580 215M330 150L580 240\" fill=\"none\" stroke=\"#a483db\" stroke-width=\"3\"/><polygon points=\"300,45 220,215 380,215\" fill=\"#d9c9f2\" fill-opacity=\".7\" stroke=\"#6b49a4\" stroke-width=\"2\"/><polygon points=\"300,45 330,30 410,200 380,215\" fill=\"#a98fd1\" fill-opacity=\".6\" stroke=\"#6b49a4\" stroke-width=\"2\"/></svg><canvas aria-hidden=\"true\" hidden></canvas></div><figcaption class=\"rf-help\">A triangular prism with seven modeled wavelengths. The static illustration is approximate; the table shows exact model outcomes. Drag to aim, or use the controls below. Exact model data is available as text.</figcaption></figure>\n  <form class=\"rf-stack\"><div class=\"rf-cluster\"><button class=\"rf-button\" type=\"button\" data-rf-prism-play disabled>Start prism spin</button><button class=\"rf-button rf-button--outline\" type=\"reset\" disabled>Reset prism</button></div><div class=\"rf-grid\">\n    <label class=\"rf-field\"><span class=\"rf-label\">Beam height · <output aria-live=\"off\" data-rf-prism-value=\"height\">0</output></span><input class=\"rf-range\" type=\"range\" name=\"height\" min=\"-0.8\" max=\"0.8\" step=\"0.01\" value=\"0\" aria-label=\"Beam height\" disabled></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Beam angle · <output aria-live=\"off\" data-rf-prism-value=\"angle\">0</output>°</span><input class=\"rf-range\" type=\"range\" name=\"angle\" min=\"-35\" max=\"35\" step=\"0.1\" value=\"0\" aria-label=\"Beam angle\" disabled></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Refractive index · <output aria-live=\"off\" data-rf-prism-value=\"index\">1.45</output></span><input class=\"rf-range\" type=\"range\" name=\"index\" min=\"1.2\" max=\"2.2\" step=\"0.01\" value=\"1.45\" aria-label=\"Refractive index\" disabled></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Dispersion · <output aria-live=\"off\" data-rf-prism-value=\"dispersion\">0.12</output></span><input class=\"rf-range\" type=\"range\" name=\"dispersion\" min=\"0\" max=\"0.3\" step=\"0.01\" value=\"0.12\" aria-label=\"Dispersion\" disabled></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Scene turn · <output aria-live=\"off\" data-rf-prism-value=\"turn\">25</output>°</span><input class=\"rf-range\" type=\"range\" name=\"turn\" min=\"-180\" max=\"180\" step=\"0.1\" value=\"25\" aria-label=\"Scene turn\" disabled></label>\n    <label class=\"rf-field\"><span class=\"rf-label\">Scene tilt · <output aria-live=\"off\" data-rf-prism-value=\"tilt\">-15</output>°</span><input class=\"rf-range\" type=\"range\" name=\"tilt\" min=\"-60\" max=\"60\" step=\"1\" value=\"-15\" aria-label=\"Scene tilt\" disabled></label>\n  </div></form>\n  <p class=\"rf-help\" role=\"status\" data-rf-prism-status>Static illustration. Controls become available with JavaScript; exact default ray data remains readable.</p>\n  <details><summary>Read beam data</summary><div class=\"rf-table-wrap\" tabindex=\"0\" role=\"region\" aria-label=\"Prism ray data\"><table class=\"rf-table\"><caption>Seven model wavelengths. Indices are unitless; exit angles are relative to the scene's positive horizontal axis.</caption><thead><tr><th scope=\"col\">Wavelength (nm)</th><th scope=\"col\">Index</th><th scope=\"col\">Outcome</th><th scope=\"col\">Internal reflections</th><th scope=\"col\">Exit angle</th></tr></thead><tbody data-rf-prism-rays><!-- rf:prism-rays:start -->\n<tr><td>700</td><td>1.4041</td><td>exited</td><td>0</td><td>-32.41°</td></tr>\n<tr><td>650</td><td>1.4159</td><td>exited</td><td>0</td><td>-33.80°</td></tr>\n<tr><td>600</td><td>1.4308</td><td>exited</td><td>0</td><td>-35.65°</td></tr>\n<tr><td>550</td><td>1.4500</td><td>exited</td><td>0</td><td>-38.24°</td></tr>\n<tr><td>500</td><td>1.4752</td><td>exited</td><td>0</td><td>-42.16°</td></tr>\n<tr><td>450</td><td>1.5093</td><td>exited</td><td>0</td><td>-49.50°</td></tr>\n<tr><td>400</td><td>1.5569</td><td>exited</td><td>1</td><td>-120.00°</td></tr>\n<!-- rf:prism-rays:end --></tbody></table></div></details>\n</section>",
    "cssBytes": 6934
  }
];
