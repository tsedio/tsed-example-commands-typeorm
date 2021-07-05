import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";
import {deserialize} from "@tsed/json-mapper";
import {User} from "../entity/User";
import {Inject} from "@tsed/di";
import {UserRepository} from "../services/UsersRepository";

export interface UsersCommandContext extends Omit<User, "id"> {
  id?: number;
  action: "create" | "list";
}

@Command({
  name: "users",
  description: "Command description",
  args: {
    "action": {
      description: "Action",
      type: String
    }
  },
  options: {},
  allowUnknownOption: false
})
export class UsersCommand implements CommandProvider {
  @Inject()
  protected repository: UserRepository;

  /**
   *  Ask questions with Inquirer. Return an empty array or don't implement the method to skip this step
   */
  async $prompt(initialOptions: Partial<UsersCommandContext>): Promise<QuestionOptions> {
    switch (initialOptions.action) {
      case "create":
        return [
          {
            type: "input",
            message: "Which first name",
            name: "firstName"
          },
          {
            type: "input",
            message: "Which last name",
            name: "lastName"
          },
          {
            type: "number",
            message: "Which age",
            name: "age"
          }
        ];
      case "list":
        const users = await this.repository.find();
        return [
          {
            type: "list",
            message: "select one",
            name: "id",
            choices: users.map(({firstName, lastName, id}) => {
              return {value: id, name: firstName + " " + lastName};
            })
          }
        ];
      default:
        return [];
    }
  }

  /**
   *  This step run your tasks with Listr module
   */
  async $exec(ctx: UsersCommandContext): Promise<any> {
    switch (ctx.action) {
      case "create":
        return this.create(ctx);
      case "list":
        return await this.displayUser(ctx);
      default:
        return [];
    }

  }

  private async displayUser(ctx: UsersCommandContext) {
    const user = await this.repository.findOne({id: +ctx.id!});

    if (user) {
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log("Not found");
    }

    return [];
  }

  private create(ctx: UsersCommandContext) {
    const user: User = deserialize(ctx, {type: User});

    return [
      {
        title: "Create user in database",
        task: () => this.repository.insert(user)
      }
    ];
  }
}
