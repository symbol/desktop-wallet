import { AddressBook, IContact } from 'symbol-address-book';

export const addressBookMock: AddressBook = new AddressBook();
const contact1: IContact = {
    id: '5c9093c7-2da2-476e-bc28-87f24a83cd0c',
    address: 'TAVVVJBBCTYJDWC7TQPSVNHK2IPNY6URKK4DTHY',
    name: 'Alice',
    phone: '+34 000000000',
    isBlackListed: true,
};
addressBookMock.addContact(contact1);
