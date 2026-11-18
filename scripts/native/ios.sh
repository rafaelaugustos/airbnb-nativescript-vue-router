#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

out="${OUT:-$(mktemp -d /tmp/airbnb-showcase.XXXXXX)}"
mkdir -p "$out"
simulator=$(xcrun simctl create "AirbnbShowcase-$$" \
  "${IOS_DEVICE_TYPE:-com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro}" \
  "${IOS_RUNTIME:-com.apple.CoreSimulator.SimRuntime.iOS-26-2}")
cleanup() {
  xcrun simctl shutdown "$simulator" >/dev/null 2>&1 || true
  xcrun simctl delete "$simulator" >/dev/null 2>&1 || true
}
trap cleanup EXIT
xcrun simctl boot "$simulator"
xcrun simctl bootstatus "$simulator" -b
npm run build:ios
xcrun simctl install "$simulator" platforms/ios/build/Debug-iphonesimulator/airbnbnativescriptvuerouter.app
"${RUBY:-ruby}" scripts/native/project.rb "$out"
xcodebuild test -project "$out/AirbnbChecks.xcodeproj" -scheme AirbnbChecks \
  -destination "platform=iOS Simulator,id=$simulator" \
  -derivedDataPath "$out/build" -collect-test-diagnostics never \
  -resultBundlePath "$out/checks.xcresult"
xcrun xcresulttool get test-results summary --path "$out/checks.xcresult" > "$out/summary.json"
printf 'Native results: %s\n' "$out"
