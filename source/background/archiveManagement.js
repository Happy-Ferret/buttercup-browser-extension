import { ArchiveManager, Web } from "buttercup-web";

const { LocalStorageInterface } = Web;

const sharedManager = new ArchiveManager(new LocalStorageInterface());

export { sharedManager };
