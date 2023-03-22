import { createStoreon } from 'storeon'

import { messages } from './messages'
import {contacts} from "./contacts";
import {customize} from "./customize";
import {user} from "./user";

export const store = createStoreon([messages, contacts, customize, user])