import * as module from './';
import * as contentsModule from './content';

describe('models module', () => {
    it('should be able to import from models as a module', () => {
        expect(module).toBeTruthy();
        expect(contentsModule).toBeTruthy();
    });
});
