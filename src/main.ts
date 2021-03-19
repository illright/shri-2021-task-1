import { Leaders, Vote, Chart, Diagram, Activity } from './slides/index';
import type { Slide } from './data';

interface SSRComponent {
	render(props: any): { html: string, css: string, head: string }
}

const views: Record<Slide['alias'], SSRComponent> = {
	leaders: Leaders as unknown as SSRComponent,
	vote: Vote as unknown as SSRComponent,
	chart: Chart as unknown as SSRComponent,
	diagram: Diagram as unknown as SSRComponent,
	activity: Activity as unknown as SSRComponent,
};

function renderTemplate(alias: Slide['alias'], data: Slide['data']) {
	return views[alias].render({ data }).html;
}

(window as any).renderTemplate = renderTemplate;
