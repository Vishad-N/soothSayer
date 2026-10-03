# Project conventions

> SkillGod manages the memory block below.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-10-03 18:25)

# SkillGod Active

Before any **non-trivial coding** task (implement, fix, refactor, debug, wire integrations):
1. Prefer shell: `sg inject "<task>"` (stdout only; exit 0 = success)
2. Or MCP `sg_inject_context` with the user task — if it stalls >5s, cancel and use CLI/digests
3. Digests in this block are the insurance policy when tools are skipped

After completing **meaningful** work (decisions, architecture, non-obvious fixes):
1. Shell: `sg capture --task "..." --output "..."`  **or**
2. MCP `sg_capture_turn` with task + short summary
3. Or `sg remember "decision: ..."`

**Also:** `sg find "<task>"` · `sg timeline` · `sg events --last 20` · `sg doctor`

## SkillGod health
- version: 1.0.1+794a995
- project_id: `visha-90fc8883`
- last inject: 2026-10-03T18:25:44 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\OneDrive\\Desktop\\work\\soothsayer-web\\src\\styles\\global.css", "oldString": ".the.on text.the-sub{opacity:1;transform:none}\n", "newString": ".t
- {"filePath": "c:\\Users\\visha\\OneDrive\\Desktop\\work\\soothsayer-web\\src\\styles\\global.css", "oldString": ".the.on{filter:drop-shadow(0 0 6px rgba(0,217,255,.45))}", "newStri
- {"filePath": "c:\\Users\\visha\\OneDrive\\Desktop\\work\\soothsayer-web\\src\\styles\\global.css", "oldString": ".the-base{stroke:rgba(154,168,183,.5);opacity:0;transition:opacity 
- {"stdout": "948: * @deprecated Use `rolldownOptions` instead.\n952: * @deprecated Use `rolldownOptions` instead.\n954: rollupOptions?: Omit<RolldownOptions, \"input\" | \"logLevel\
- {"filePath": "c:\\Users\\visha\\OneDrive\\Desktop\\work\\soothsayer-web\\src\\components\\transformation\\useTransformationScroll.js", "oldString": " const build = (reduced) => {",
- {"filePath": "C:\\Users\\visha\\Downloads\\design-studio-homepage (1)\\design-studio-homepage\\react-app\\src\\components\\Hero.jsx", "oldString": " design interiors<br />that hold
- {"stdout": " </div>\n </div>\n </section>\n\n {/* STUDIO GALLERY */}\n <section className=\"gallery wrap\">\n <div className=\"section-head\">\n

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
