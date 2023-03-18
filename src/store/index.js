import { createStoreon } from 'storeon'

import { messages } from './messages'
import {contacts} from "./contacts";
import {customize} from "./customize";

export const store = createStoreon([messages, contacts, customize])