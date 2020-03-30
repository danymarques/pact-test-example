import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Matchers } from '@pact-foundation/pact';

import { PactWrapper } from '../../../pact-wrapper';
import { UserService, User } from './user.service';

describe('User Service Pact', () => {
    const provider = new PactWrapper('api-identifier');

    beforeAll(async () => {
        await provider.init();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [UserService],
        });
    });

    afterEach(async () => {
        await provider.verify();
    });

    afterAll(async () => {
        await provider.finalize();
    });

    describe('get()', () => {
        const userId = 1;

        const expectedUser: User = {
            id: 1,
            firstName: 'Toto',
            lastName: 'Titi',
        };

        beforeAll(async () => {
            await provider.addInteraction({
                state: `user 1 exists`,
                uponReceiving: 'a request to GET a user',
                withRequest: {
                    method: 'GET',
                    path: `/api/user/${userId}`,
                },
                willRespondWith: {
                    status: 200,
                    body: {
                        id: expectedUser.id,
                        firstName: Matchers.string(expectedUser.firstName),
                        lastName: Matchers.string(expectedUser.lastName),
                    },
                },
            });
        });

        it('should get user with id 1', async () => {
            const userService: UserService = TestBed.inject(UserService);
            const response = await userService.get(userId).toPromise();
            expect(response).toEqual(expectedUser);
        });
    });
});
