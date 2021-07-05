import {Controller, Get} from "@tsed/common";
import {UserRepository} from "../services/UsersRepository";
import {Inject} from "@tsed/di";

@Controller("/users")
export class UsersController {
  @Inject()
  protected repository: UserRepository;

  @Get("/")
  get() {
    return this.repository.find();
  }
}
