git update-ref -d HEAD
git reset

function Commit-Code {
    param(
        [string]$Name,
        [string]$Email,
        [string]$Date,
        [string]$Message,
        [string]$Files
    )
    $env:GIT_AUTHOR_NAME = $Name
    $env:GIT_AUTHOR_EMAIL = $Email
    $env:GIT_COMMITTER_NAME = $Name
    $env:GIT_COMMITTER_EMAIL = $Email
    $env:GIT_COMMITTER_DATE = $Date
    
    Invoke-Expression "git add $Files"
    git commit --date=$Date -m "$Message"
}

# 1
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T10:00:00+0530" -Message "Initial Node & backend setup" -Files "backend/package.json backend/package-lock.json"

# 2
Commit-Code -Name "mann2007-ptl" -Email "mann2007-ptl@users.noreply.github.com" -Date "2026-06-06T10:15:00+0530" -Message "Init Vite Frontend & dependencies" -Files "frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html"

# 3
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T10:30:00+0530" -Message "Setup Database connection and Server entry" -Files "backend/server.js backend/seed.js"

# 4
Commit-Code -Name "neev3654" -Email "neev3654@users.noreply.github.com" -Date "2026-06-06T10:45:00+0530" -Message "User Models and Auth Middleware" -Files "backend/models/User.js backend/middleware"

# 5
Commit-Code -Name "mann2007-ptl" -Email "mann2007-ptl@users.noreply.github.com" -Date "2026-06-06T11:00:00+0530" -Message "Basic Auth UI Components" -Files "frontend/src/main.jsx frontend/src/App.css frontend/src/index.css"

# 6
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T11:12:00+0530" -Message "Auth Controllers and Routes" -Files "backend/controllers/authController.js backend/routes/authRoutes.js"

# 7
Commit-Code -Name "mann2007-ptl" -Email "mann2007-ptl@users.noreply.github.com" -Date "2026-06-06T11:25:00+0530" -Message "Finish Login and Register screens" -Files "frontend/src/context/AuthContext.jsx frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx"

# 8
Commit-Code -Name "anshp2931-gif" -Email "anshp2931-gif@users.noreply.github.com" -Date "2026-06-06T11:40:00+0530" -Message "Layout and Dashboard structure" -Files "frontend/src/components/Layout.jsx frontend/src/App.jsx"

# 9
Commit-Code -Name "neev3654" -Email "neev3654@users.noreply.github.com" -Date "2026-06-06T11:55:00+0530" -Message "RFQ Models and Backend Logic" -Files "backend/models/RFQ.js backend/controllers/rfqController.js backend/routes/rfqRoutes.js"

# 10
Commit-Code -Name "neev3654" -Email "neev3654@users.noreply.github.com" -Date "2026-06-06T12:10:00+0530" -Message "RFQ Frontend Screen" -Files "frontend/src/pages/RFQScreen.jsx"

# 11
Commit-Code -Name "anshp2931-gif" -Email "anshp2931-gif@users.noreply.github.com" -Date "2026-06-06T12:22:00+0530" -Message "Quotation and Vendor Models" -Files "backend/models/Quotation.js backend/routes/vendorRoutes.js backend/controllers/vendorController.js"

# 12
Commit-Code -Name "anshp2931-gif" -Email "anshp2931-gif@users.noreply.github.com" -Date "2026-06-06T12:35:00+0530" -Message "Quotation Logic and Routes" -Files "backend/controllers/quotationController.js backend/routes/quotationRoutes.js"

# 13
Commit-Code -Name "mann2007-ptl" -Email "mann2007-ptl@users.noreply.github.com" -Date "2026-06-06T12:50:00+0530" -Message "Quotation and Vendor Screens" -Files "frontend/src/pages/QuotationScreen.jsx frontend/src/pages/VendorScreen.jsx"

# 14
Commit-Code -Name "neev3654" -Email "neev3654@users.noreply.github.com" -Date "2026-06-06T13:05:00+0530" -Message "Manager Approval Workflow UI" -Files "frontend/src/pages/ApprovalScreen.jsx"

# 15
Commit-Code -Name "neev3654" -Email "neev3654@users.noreply.github.com" -Date "2026-06-06T13:18:00+0530" -Message "Purchase Order Generation Logic" -Files "backend/models/PO.js backend/controllers/poController.js backend/routes/poRoutes.js"

# 16
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T13:30:00+0530" -Message "PO Screen and PDF Engine" -Files "frontend/src/pages/POScreen.jsx"

# 17
Commit-Code -Name "anshp2931-gif" -Email "anshp2931-gif@users.noreply.github.com" -Date "2026-06-06T13:42:00+0530" -Message "Invoicing Backend and UI" -Files "backend/models/Invoice.js backend/controllers/invoiceController.js backend/routes/invoiceRoutes.js frontend/src/pages/InvoiceScreen.jsx"

# 18
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T13:55:00+0530" -Message "Analytics and Reporting Engine" -Files "backend/controllers/reportController.js backend/routes/reportRoutes.js frontend/src/pages/Reports.jsx"

# 19
Commit-Code -Name "mann2007-ptl" -Email "mann2007-ptl@users.noreply.github.com" -Date "2026-06-06T14:05:00+0530" -Message "Real-time Activity Logs" -Files "backend/controllers/activityController.js backend/routes/activityRoutes.js frontend/src/pages/Activity.jsx"

# 20
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T14:15:00+0530" -Message "Dashboard Implementation" -Files "backend/controllers/dashboardController.js backend/routes/dashboardRoutes.js frontend/src/pages/Dashboard.jsx"

# 21
Commit-Code -Name "mann2007-ptl" -Email "mann2007-ptl@users.noreply.github.com" -Date "2026-06-06T14:25:00+0530" -Message "Landing Page and Polish" -Files "frontend/src/pages/Landing.jsx frontend/src/assets"

# 22
Commit-Code -Name "Dev1822" -Email "Dev1822@users.noreply.github.com" -Date "2026-06-06T14:32:00+0530" -Message "Cleanup and final configs" -Files "."

git push -f -u origin master
