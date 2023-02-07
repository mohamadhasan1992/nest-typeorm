import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./users.entity";
import { UsersService } from "./users.service";




describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async() => {
        // create fake copy of users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUser = users.filter(user => user.email === email);
                return Promise.resolve(filteredUser)
            },
            create: (email: string, password: string) => {
                const newUser = {id: Math.floor(Math.random() * 9999), email, password}as User;
                users.push(newUser);
                return Promise.resolve(newUser)
            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('can create an instance of service', async() => {
        expect(service).toBeDefined();
    });
    
    it('creates new user with hashed password', async() => {
        const user = await service.signup('absd@yahoo.com', 'abcdef45');
        expect(user.password).not.toEqual('abcdef45');
        
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user email is exist already', async() => {
        await service.signup('absd@yahoo.com', 'absd123456')
        try{
            await service.signup('absd@yahoo.com', 'absd123456');
        }catch(err){
            expect(err).toBeInstanceOf(BadRequestException)
        }
    });

    it('throws if signin is called with an unused error', async() => {
        try{
            await service.signin('asdalsdh@yahoo.com', '123654789')
        }catch(err){
            expect(err).toBeInstanceOf(NotFoundException)
        }
    })
    it('throws error if password is invalid', async() => {
        await service.signup('kasjdakd@yahoo.com', 'pasword9865')
        try{
            await service.signin('kasjdakd@yahoo.com', 'testpasword')
        }catch(err){
            expect(err).toBeInstanceOf(BadRequestException)
        }
    })
    it('returns a user if password is correct', async() => {
        const userA = await service.signup('asdf@yahoo.com', "123456789");
        const user = await service.signin('asdf@yahoo.com', "123456789");
        expect(user).toBeDefined();
    })

})