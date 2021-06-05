import BeginnersGuide from './beginnersGuide';
import ExpandedDefinition from './expandedDefinition';
import ListPost from './listPost';
import StepByStepGuide from './stepByStepGuide';

export function options() {
    return [
        "List Post",
        "Step by Step",
        "Expanded Definition",
        "Beginners Guide"
    ];
}

export function fromOption(userOption: string) : string | null {
    switch(userOption) {
        case "List Post": {
            return new ListPost().render();
        }
        case "Step by Step": {
            return new StepByStepGuide().render();
        }
        case "Expanded Definition": {
            return new ExpandedDefinition().render();
        }
        case "Beginners Guide": {
            return new BeginnersGuide().render();
        }
        default: {
            return null;
        }
    }
}
