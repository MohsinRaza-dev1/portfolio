@echo off
echo 🚀 Deploying Mohsin Raza Portfolio to Vercel...
echo.

REM Install Vercel CLI globally
echo Installing Vercel CLI...
call npm i -g vercel

REM Login to Vercel
echo.
echo Please login to Vercel when prompted...
call vercel login

REM Deploy to production
echo.
echo Deploying your portfolio...
call vercel --prod

echo.
echo ✅ Deployment complete!
echo Your portfolio is now permanently online!
echo.
echo Check your Vercel dashboard for the permanent URL.
echo.
