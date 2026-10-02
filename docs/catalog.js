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
    "cssBytes": 2360
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
    "cssBytes": 2360
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
    "cssBytes": 2360
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
    "cssBytes": 2360
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
    "cssBytes": 2360
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
    "cssBytes": 2360
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
    "cssBytes": 2360
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
    "cssBytes": 2390
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
    "cssBytes": 4750
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
    "cssBytes": 3049
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
    "cssBytes": 543
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
    "cssBytes": 2033
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
    "html": "<form class=\"rf-card rf-stack\" data-demo-form style=\"max-width:30rem\">\n  <p class=\"rf-eyebrow\">A small detail. A little less friction.</p>\n  <h3 class=\"rf-card__title\">See what you’re typing.</h3>\n  <div class=\"rf-field\" data-rf-password>\n    <label class=\"rf-label\" for=\"reveal-password\">Password</label>\n    <div class=\"rf-input-action\">\n      <input class=\"rf-input\" id=\"reveal-password\" name=\"password\" type=\"password\" autocomplete=\"new-password\" minlength=\"8\" required aria-describedby=\"reveal-help\">\n      <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-password-toggle aria-label=\"Show password\" aria-controls=\"reveal-password\" aria-pressed=\"false\" hidden>Show</button>\n    </div>\n    <p class=\"rf-help\" id=\"reveal-help\">Use a sample password of at least 8 characters. This demo sends nothing.</p>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Try the form</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Reset</button></div>\n</form>",
    "cssBytes": 12860
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
    "html": "<form class=\"rf-card rf-stack\" data-demo-form style=\"max-width:34rem\">\n  <p class=\"rf-eyebrow\">Make every word count.</p>\n  <h3 class=\"rf-card__title\">A little introduction.</h3>\n  <div class=\"rf-field\" data-rf-counter>\n    <label class=\"rf-label\" for=\"profile-bio\">Your bio</label>\n    <textarea class=\"rf-textarea\" id=\"profile-bio\" name=\"bio\" maxlength=\"160\" rows=\"3\" placeholder=\"What do you love making?\" aria-describedby=\"bio-help bio-count\"></textarea>\n    <div class=\"rf-cluster\" style=\"justify-content:space-between\"><p class=\"rf-help\" id=\"bio-help\">Keep it short. Make it you.</p><p class=\"rf-help rf-count\" id=\"bio-count\" data-rf-count>Up to 160 characters.</p></div>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Preview profile</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Start over</button></div>\n</form>",
    "cssBytes": 12860
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
    "html": "<form class=\"rf-card rf-stack\" data-demo-form style=\"max-width:34rem\">\n  <p class=\"rf-eyebrow\">A few words. A clearer picture.</p>\n  <h3 class=\"rf-card__title\">What are you making?</h3>\n  <div class=\"rf-stack\" data-rf-tags data-rf-tags-name=\"topics\" data-rf-tags-max=\"5\">\n    <div class=\"rf-field\">\n      <label class=\"rf-label\" for=\"project-tag\">Project topics</label>\n      <div class=\"rf-input-action\"><input class=\"rf-input\" id=\"project-tag\" data-rf-tag-input maxlength=\"32\" placeholder=\"Add a topic…\" aria-describedby=\"tags-help\"><button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-tag-add>Add tag</button></div>\n      <p class=\"rf-help\" id=\"tags-help\">Press Enter or Add tag. Choose up to five topics, 32 characters each.</p>\n    </div>\n    <ul class=\"rf-tag-list\" data-rf-tag-list aria-label=\"Selected topics\">\n      <li class=\"rf-tag\"><span>Design</span><input type=\"hidden\" name=\"topics\" value=\"Design\"></li>\n      <li class=\"rf-tag\"><span>Accessibility</span><input type=\"hidden\" name=\"topics\" value=\"Accessibility\"></li>\n    </ul>\n    <p class=\"rf-help\" role=\"status\"></p>\n  </div>\n  <div class=\"rf-cluster\"><button class=\"rf-button\" type=\"submit\">Preview topics</button><button class=\"rf-button rf-button--ghost\" type=\"reset\">Reset topics</button></div>\n</form>",
    "cssBytes": 12860
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
    "cssBytes": 13428
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
    "html": "<form class=\"rf-card rf-stack\" data-rf-check-progress style=\"max-width:34rem\">\n  <div class=\"rf-cluster\" style=\"justify-content:space-between\"><p class=\"rf-eyebrow\">Small steps. Something real.</p><span class=\"rf-badge\">Your launch plan</span></div>\n  <h3 class=\"rf-card__title\">Bring your idea into the world.</h3>\n  <label class=\"rf-help\" for=\"launch-progress\">Launch preparation</label>\n  <progress class=\"rf-progress\" id=\"launch-progress\" value=\"1\" max=\"3\">1 of 3 steps complete</progress>\n  <ul class=\"rf-launch-list\">\n    <li><label><input type=\"checkbox\" name=\"launch\" value=\"idea\" checked><span><strong>Give your idea a name</strong><small>A good beginning is a clear direction.</small></span></label></li>\n    <li><label><input type=\"checkbox\" name=\"launch\" value=\"build\"><span><strong>Make your first version</strong><small>Pick your components. Build one useful thing.</small></span></label></li>\n    <li><label><input type=\"checkbox\" name=\"launch\" value=\"share\"><span><strong>Share it with someone</strong><small>A little feedback goes a long way.</small></span></label></li>\n  </ul>\n  <p class=\"rf-help\" role=\"status\" data-rf-check-status>1 of 3 steps complete</p>\n  <button class=\"rf-button rf-button--ghost\" type=\"reset\">Reset checklist</button>\n</form>",
    "cssBytes": 14337
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
    "html": "<section class=\"rf-stack\" data-rf-billing aria-labelledby=\"billing-title\">\n  <div><p class=\"rf-eyebrow\">A clear choice, at your pace.</p><h3 id=\"billing-title\">A little room to grow.</h3><p class=\"rf-muted\">Illustrative plans for a fictional workspace.</p></div>\n  <fieldset class=\"rf-segmented\"><legend>Billing interval</legend><label><input type=\"radio\" name=\"example-billing\" value=\"monthly\" checked><span>Monthly</span></label><label><input type=\"radio\" name=\"example-billing\" value=\"yearly\"><span>Yearly · save 20%</span></label></fieldset>\n  <div class=\"rf-grid\">\n    <article class=\"rf-card rf-stack\"><h4 class=\"rf-card__title\">Personal</h4><p class=\"rf-muted\">A home for your own ideas.</p><p class=\"rf-price\"><span data-rf-monthly=\"$10\" data-rf-yearly=\"$8\">$10</span></p><p class=\"rf-help\" data-rf-billing-note>per month, billed monthly</p><a class=\"rf-button rf-button--outline\" href=\"#personal-plan\">Choose Personal</a></article>\n    <article class=\"rf-card rf-stack rf-pricing__featured\"><span class=\"rf-badge\" data-variant=\"success\">For building together</span><h4 class=\"rf-card__title\">Studio</h4><p class=\"rf-muted\">More space for your next chapter.</p><p class=\"rf-price\"><span data-rf-monthly=\"$25\" data-rf-yearly=\"$20\">$25</span></p><p class=\"rf-help\" data-rf-billing-note>per month, billed monthly</p><a class=\"rf-button\" href=\"#studio-plan\">Choose Studio</a></article>\n  </div>\n  <p class=\"rf-help\">A pricing interface demo. No payment is collected. Yearly examples represent $96 and $240 per year.</p>\n</section>",
    "cssBytes": 15960
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
    "cssBytes": 6296
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
    "cssBytes": 3195
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
    "cssBytes": 4672
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
    "cssBytes": 5617
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
    "cssBytes": 3756
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
    "cssBytes": 3195
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
    "cssBytes": 3012
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
    "cssBytes": 4819
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
    "cssBytes": 2845
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
    "html": "<section class=\"rf-section rf-container\" id=\"contact\"><div class=\"rf-grid\"><div><p class=\"rf-eyebrow\">Start a conversation</p><h2 class=\"rf-section__heading\">Tell us what’s next.</h2><p class=\"rf-section__intro\">A sample form layout. Connect it to your own backend before publishing.</p></div><form class=\"rf-card rf-stack\" data-demo-form><div class=\"rf-field\"><label class=\"rf-label\" for=\"contact-name\">Name</label><input class=\"rf-input\" id=\"contact-name\" name=\"name\" autocomplete=\"name\" required></div><div class=\"rf-field\"><label class=\"rf-label\" for=\"contact-email\">Email</label><input class=\"rf-input\" id=\"contact-email\" type=\"email\" name=\"email\" autocomplete=\"email\" required></div><div class=\"rf-field\"><label class=\"rf-label\" for=\"contact-message\">Message</label><textarea class=\"rf-textarea\" id=\"contact-message\" name=\"message\" required></textarea></div><button class=\"rf-button\" type=\"submit\">Send message</button></form></div></section>",
    "cssBytes": 7179
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
    "cssBytes": 10343
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
    "cssBytes": 10500
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
    "cssBytes": 12733
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
    "cssBytes": 9607
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
    "cssBytes": 11967
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
    "cssBytes": 7983
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
    "cssBytes": 2360
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
    "html": "<form class=\"rf-stack\" data-demo-form>\n  <label class=\"rf-field\">\n    <span class=\"rf-label\">\n      Verification code\n    </span>\n    <input class=\"rf-input\" name=\"code\" type=\"text\" inputmode=\"numeric\" autocomplete=\"one-time-code\" pattern=\"[0-9]{6}\" maxlength=\"6\" required placeholder=\"123456\" aria-describedby=\"code-help\">\n    <span id=\"code-help\" class=\"rf-help\">\n      Enter the six-digit code. Demo only; no verification request is sent.\n    </span>\n  </label>\n  <button class=\"rf-button\" type=\"submit\">\n    Verify code\n  </button>\n</form>",
    "cssBytes": 3984
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
    "cssBytes": 7983
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
    "cssBytes": 7983
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
    "cssBytes": 10500
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
    "cssBytes": 7983
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
    "cssBytes": 10500
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
    "cssBytes": 10343
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
    "cssBytes": 7983
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
    "cssBytes": 7983
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
    "html": "<form class=\"rf-stack\" data-rf-step-form data-demo-form>\n  <p class=\"rf-help\" role=\"status\">\n    Complete your project details\n  </p>\n  <fieldset class=\"rf-fieldset rf-stack\" data-rf-step>\n    <legend>\n      1. Your project\n    </legend>\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Project name\n      </span>\n      <input class=\"rf-input\" name=\"project\" required autocomplete=\"off\">\n    </label>\n  </fieldset>\n  <fieldset class=\"rf-fieldset rf-stack\" data-rf-step>\n    <legend>\n      2. Your contact\n    </legend>\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Contact email\n      </span>\n      <input class=\"rf-input\" type=\"email\" name=\"email\" required autocomplete=\"email\">\n    </label>\n  </fieldset>\n  <div class=\"rf-cluster\">\n    <button class=\"rf-button rf-button--outline\" type=\"button\" data-rf-step-previous hidden>\n      Previous\n    </button>\n    <button class=\"rf-button\" type=\"button\" data-rf-step-next hidden>\n      Continue\n    </button>\n    <button class=\"rf-button\" type=\"submit\" data-rf-step-submit>\n      Finish demo\n    </button>\n  </div>\n  <p class=\"rf-help\">\n    Demo only. No data is submitted or stored.\n  </p>\n</form>",
    "cssBytes": 11967
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
    "cssBytes": 10343
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
    "cssBytes": 8769
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
    "cssBytes": 8769
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
    "cssBytes": 2302
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
    "html": "<section class=\"rf-section rf-card\">\n  <h3 class=\"rf-section__heading\">\n    Good things, occasionally.\n  </h3>\n  <p class=\"rf-section__intro\">\n    A little inspiration for what you make next.\n  </p>\n  <form class=\"rf-newsletter\" data-demo-form>\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Email address\n      </span>\n      <input class=\"rf-input\" type=\"email\" name=\"email\" autocomplete=\"email\" required placeholder=\"you@example.com\">\n    </label>\n    <button class=\"rf-button\" type=\"submit\">\n      Subscribe\n    </button>\n  </form>\n  <p class=\"rf-help\" style=\"margin-top:1rem\">\n    Demo only. No subscription is created.\n  </p>\n</section>",
    "cssBytes": 7179
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
    "cssBytes": 3756
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
    "cssBytes": 3195
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
    "html": "<section class=\"rf-card rf-auth\">\n  <h3>\n    Welcome back.\n  </h3>\n  <p class=\"rf-muted\">\n    A little closer to your next idea.\n  </p>\n  <form data-demo-form>\n    <label class=\"rf-field\">\n      <span class=\"rf-label\">\n        Email\n      </span>\n      <input class=\"rf-input\" type=\"email\" name=\"email\" autocomplete=\"username\" required>\n    </label>\n    <div class=\"rf-field\" data-rf-password>\n      <label class=\"rf-label\" for=\"signin-password\">Password</label>\n      <div class=\"rf-input-action\">\n        <input class=\"rf-input\" id=\"signin-password\" type=\"password\" name=\"password\" autocomplete=\"current-password\" required>\n        <button class=\"rf-button rf-button--outline rf-button--small\" type=\"button\" data-rf-password-toggle aria-label=\"Show password\" aria-controls=\"signin-password\" aria-pressed=\"false\" hidden>Show</button>\n      </div>\n    </div>\n    <button class=\"rf-button\" type=\"submit\">\n      Sign in\n    </button>\n  </form>\n  <p class=\"rf-help\" style=\"margin-top:1rem\">\n    Preview only. Do not enter a real password.\n  </p>\n</section>",
    "cssBytes": 15162
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
    "cssBytes": 8711
  }
];
