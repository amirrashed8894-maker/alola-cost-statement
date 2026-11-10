# Alola Cost Statement (بيان تكلفة — شركة العلا)

Static PWA (no build). Render Static Site: build command `true`, publish `.`. Login via alola-maggi-auth (app id `cost`).
Layout and math follow Al-Ola Station 1.3.1 (`statementPage` + `supply-cost.js`, copied verbatim).
Drop a packing-list PDF (ALOLADATA1/ALOLACHUNKS kind `load`) to fill the statement.
Exported PDF embeds `ALOLADATA1` with kind `cost` (statement header, deductions, lines).
Printed on official Alola letterhead (same mast/footer as the packing-list app) with «اعتماد: شركة الراشد للتجارة». Owner names matching ادريس/إدريس are omitted from the print.
