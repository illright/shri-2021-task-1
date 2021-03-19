import { Leaders, Vote, Chart, Diagram, Activity } from './slides/index';
import type { Slide } from './data';

declare let slide: Slide;

const views = {
	leaders: Leaders,
	vote: Vote,
	chart: Chart,
	diagram: Diagram,
	activity: Activity,
};

document.body.innerHTML = views[slide.alias].render({ data: slide.data }).html;
