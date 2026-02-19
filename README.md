## Development

### Emulator

#### Kepler CLI
1. `kepler virtual-device start`
2. `npm run build:debug`
3. `npm start`
4. `kepler device start-port-forwarding --device VirtualDevice -p 8081 --forward false`
5. `kepler run-kepler build/x86_64-debug/localvideoasset_x86_64.vpkg com.amazondeveloper.localvideoasset -d VirtualDevice`

* This sets up Fast Refresh for the app.
* Note: Do not press `r` to reload in metro, it will not work. Instead re-run step 5.

##### Stop Emulator
1. `kepler device terminate-app --device VirtualDevice --appName com.amazondeveloper.localvideoasset`
2. `kepler device stop-port-forwarding --device VirtualDevice -p 8081 --forward false` 
3. `kepler virtual-device stop`
