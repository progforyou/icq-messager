import { createStoreon } from 'storeon'

import { messages } from './messages'
import {contacts} from "./contacts";
import {customize} from "./customize";
import {user} from "./user";
import {admin} from "./admin";

export const store = createStoreon([messages, contacts, customize, user, admin])