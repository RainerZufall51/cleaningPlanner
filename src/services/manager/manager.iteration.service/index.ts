import { ServiceSchema } from 'moleculer';
import { getById } from './methods/getById';

const iterationService: ServiceSchema = {
    name: 'manager.iterationService',
    settings: {
        rest: '/iteration'
    },
    dependencies: [],
    actions: {
        getById: {
            rest: '/getById',
            params: {
                iterationId: { type: 'string', optional: false }
            },
            async handler(ctx) {
                return this.getById(ctx)
            }
        }
    },
    methods: {
        getById
    }
};
