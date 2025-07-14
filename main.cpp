#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;
struct Person {
    string name, age, gender, lastSeen, aadhar, phone, address, complainant;
};
// Node for Binary Search Tree
struct Node {
    Person data;
    Node* left;
    Node* right;
    Node(Person p) : data(p), left(nullptr), right(nullptr) {}
};
// BST insert by name
Node* insertBST(Node* root, Person p) {
    if (!root) return new Node(p);
    if (p.name < root->data.name)
        root->left = insertBST(root->left, p);
    else
        root->right = insertBST(root->right, p);
    return root;
}
// Trim whitespace
string trim(const string& str) {
    size_t first = str.find_first_not_of(" \t\n\r");
    size_t last = str.find_last_not_of(" \t\n\r");
    return (first == string::npos || last == string::npos) ? "" : str.substr(first, last - first + 1);
}
// Lowercase helper
string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}
// Search BST
void searchBST(Node* root, const string& key, vector<Person>& results) {
    if (!root) return;
    string nodeName = toLower(trim(root->data.name));
    string searchKey = toLower(trim(key));
    if (nodeName.find(searchKey) != string::npos)
        results.push_back(root->data);
    searchBST(root->left, key, results);
    searchBST(root->right, key, results);
}
// Load input.txt into BST and Hash Table
void loadData(Node*& root, unordered_map<string, vector<Person>>& table) {
    ifstream file("input.txt");
    string line;
    while (getline(file, line)) {
        if (trim(line).empty()) continue;
        stringstream ss(line);
        Person p;
        getline(ss, p.name, ',');
        getline(ss, p.age, ',');
        getline(ss, p.gender, ',');
        getline(ss, p.lastSeen, ',');
        getline(ss, p.aadhar, ',');
        getline(ss, p.phone, ',');
        getline(ss, p.address, ',');
        getline(ss, p.complainant, ',');
        root = insertBST(root, p);
        string key = toLower(trim(p.name));
        table[key].push_back(p);
    }
    file.close();
}
int main() {
    Node* bstRoot = nullptr;
    unordered_map<string, vector<Person>> hashTable;
    // Load data
    loadData(bstRoot, hashTable);
    // Read search term from search.txt
    ifstream sfile("search.txt");
    string searchName;
    getline(sfile, searchName);
    sfile.close();
    vector<Person> results;
    searchBST(bstRoot, searchName, results);
    ofstream outfile("output.txt");
    if (!results.empty()) {
        outfile << "Found " << results.size() << " record(s):\n";
        for (const auto& p : results) {
            outfile << "-----------------------------\n";
            outfile << "Name: " << trim(p.name) << "\n";
            outfile << "Age: " << trim(p.age) << "\n";
            outfile << "Gender: " << trim(p.gender) << "\n";
            outfile << "Last Seen: " << trim(p.lastSeen) << "\n";
            outfile << "Aadhar: " << trim(p.aadhar) << "\n";
            outfile << "Phone: " << trim(p.phone) << "\n";
            outfile << "Address: " << trim(p.address) << "\n";
            outfile << "Complainant: " << trim(p.complainant) << "\n";
        }
    } else {
        outfile << "Search failed. Person not found.";
    }
    outfile.close();

    return 0;
}
