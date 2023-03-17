import { createStoreon } from 'storeon'

import { messages } from './messages'
import {contacts} from "./contacts";

export const store = createStoreon([messages, contacts])