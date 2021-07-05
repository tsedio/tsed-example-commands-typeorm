#!/usr/bin/env node
import {CliCore} from "@tsed/cli-core";
import "@tsed/typeorm";
import {config} from "../config";
import {UsersCommand} from "./UsersCommand";

CliCore.bootstrap({
  ...config,
  commands: [
    UsersCommand
  ]
}).catch(console.error);