import App from "./App.vue";
import store from './store/index.js';
console.log('main.js', store.state.counter);
import {
	createSSRApp
} from "vue";
export function createApp() {
	const app = createSSRApp(App);
	app.use(store)
	return {
		app,
		store
	};
}