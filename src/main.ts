import { Leaders, Vote, Chart, Diagram, Activity } from './templates/index';
import type { Slide } from './data';

declare let slide: Slide;

const views = {
	leaders: Leaders,
	vote: Vote,
	chart: Chart,
	diagram: Diagram,
	activity: Activity,
};

new views[slide.alias]({
	target: document.body,
	props: { data: slide.data },
});
