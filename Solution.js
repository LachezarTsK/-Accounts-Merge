
/**
 * @param {string[][]} accounts
 * @return {string[][]}
 */
var accountsMerge = function (accounts) {
    const uniqueAccounts = new UniqueAccounts(accounts);
    return uniqueAccounts.accountsMerge();
};

class UniqueAccounts {

    /**
     * @param {string[][]} accounts
     */
    constructor(accounts) {
        this.accounts = accounts;
        this.numberOfInitialAccounts = accounts.length;
        this.rank = new Array(this.numberOfInitialAccounts).fill(0);
        this.initializeArrayParent();
    }

    initializeArrayParent() {
        this.parent = [];
        for (let i = 0; i < this.numberOfInitialAccounts; i++) {
            this.parent[i] = i;
        }
    }

    accountsMerge() {
        return this.createListWithUniqueAccounts(this.findCommonAccounts(this.accounts), this.accounts);
    }

    /**
     * @param {string[][]} accounts
     * @return {map}
     */
    findCommonAccounts(accounts) {

        const emailToAccountIndex = new Map();
        for (let i = 0; i < this.numberOfInitialAccounts; i++) {
            let size = accounts[i].length;
            const emails = accounts[i];

            for (let j = 1; j < size; j++) {
                if (!emailToAccountIndex.has(emails[j])) {
                    emailToAccountIndex.set(emails[j], i);
                } else {
                    this.unionFind(emailToAccountIndex.get(emails[j]), i);
                }
            }
        }

        return this.reverseMapEmailToAccountIndex(emailToAccountIndex);
    }

    /**
     * @param {string[][]} accounts
     * @param {map} accountIndexToEmail 
     * @return {string[][]}
     */
    createListWithUniqueAccounts(accountIndexToEmail, accounts) {

        const allUniqueAccounts = [];
        for (let [accountIndex, listOfEmails] of accountIndexToEmail) {

            const uniqueAccount = [];
            uniqueAccount.push(accounts[accountIndex][0]);
            listOfEmails.sort();
            allUniqueAccounts.push(uniqueAccount.concat(listOfEmails));
        }

        return allUniqueAccounts;
    }

    /**
     * @param {map}  emailToAccountIndex
     * @return {map}
     */
    reverseMapEmailToAccountIndex(emailToAccountIndex) {
        const accountIndexToEmail = new Map();
        for (let[email, index]of emailToAccountIndex) {
            let accountOwner = this.findParent(index);
            if (!accountIndexToEmail.has(accountOwner)) {
                accountIndexToEmail.set(accountOwner, []);
            }
            accountIndexToEmail.get(accountOwner).push(email);
        }

        return accountIndexToEmail;
    }

    /**
     * @param {number} index
     * @return {number}
     */
    findParent(index) {
        if (this.parent[index] !== index) {
            this.parent[index] = this.findParent(this.parent[index]);
        }
        return this.parent[index];
    }

    /**
     * @param {number} indexOne
     * @param {number} indexTwo
     */
    unionFind(indexOne, indexTwo) {
        indexOne = this.findParent(indexOne);
        indexTwo = this.findParent(indexTwo);
        if (indexOne !== indexTwo) {
            this.joinByRank(indexOne, indexTwo);
        }
    }

    /**
     * @param {number} indexOne
     * @param {number} indexTwo
     */
    joinByRank(indexOne, indexTwo) {
        if (this.rank[indexOne] < this.rank[indexTwo]) {
            this.parent[indexTwo] = indexOne;
        } else if (this.rank[indexOne] > this.rank[indexTwo]) {
            this.parent[indexOne] = indexTwo;
        } else {
            this.parent[indexTwo] = indexOne;
            this.rank[indexOne]++;
        }
    }
}
