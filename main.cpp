
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <cctype>
#include <string>
using namespace std;

struct Person {
    string name, age, gender, lastSeen, aadhar, phone, address, complainant;
};

vector<Person> people;

string toLower(const string& s) {
    string result = s;
    transform(result.begin(), result.end(), result.begin(), [](unsigned char c){ return tolower(c); });
    return result;
}

string trim(const string& s) {
    size_t start = s.find_first_not_of(" \t\n\r");
    size_t end = s.find_last_not_of(" \t\n\r");
    return (start == string::npos) ? "" : s.substr(start, end - start + 1);
}

void loadInput() {
    ifstream file("input.txt");
    string line;
    while (getline(file, line)) {
        if (trim(line).empty()) continue;
        Person p;
        stringstream ss(line);
        getline(ss, p.name, ',');
        getline(ss, p.age, ',');
        getline(ss, p.gender, ',');
        getline(ss, p.lastSeen, ',');
        getline(ss, p.aadhar, ',');
        getline(ss, p.phone, ',');
        getline(ss, p.address, ',');
        getline(ss, p.complainant, ',');
        people.push_back(p);
    }
    file.close();
}

void searchPerson() {
    ifstream searchFile("search.txt");
    string searchTerm;
    getline(searchFile, searchTerm);
    searchFile.close();
    searchTerm = trim(searchTerm);
    string searchLower = toLower(searchTerm);
    vector<Person> results;
    for (const auto& p : people) {
        string nameLower = toLower(trim(p.name));
        if (nameLower.find(searchLower) != string::npos) {
            results.push_back(p);
        }
    }
    ofstream out("output.txt");
    if (!results.empty()) {
        out << "Found " << results.size() << " record(s):\n";
        for (const auto& p : results) {
            out << "-----------------------------\n";
            out << "Name: " << trim(p.name) << "\n";
            out << "Age: " << trim(p.age) << "\n";
            out << "Gender: " << trim(p.gender) << "\n";
            out << "Last Seen: " << trim(p.lastSeen) << "\n";
            out << "Aadhar: " << trim(p.aadhar) << "\n";
            out << "Phone: " << trim(p.phone) << "\n";
            out << "Address: " << trim(p.address) << "\n";
            out << "Complainant: " << trim(p.complainant) << "\n";
        }
    } else {
        out << "Search failed. Person not found.";
    }
    out.close();
}

int main() {
    loadInput();
    searchPerson();
    return 0;
}
