#include <stdio.h>

int main(int argc, const char *argv[]) {
  if (argc < 3)
    return 1;
  FILE* target = fopen(argv[1], "ab");
  for (int i = 2; i < argc; ++i) {
    FILE* source = fopen(argv[i], "rb");
    char buffer[8192];
    size_t nread = 0;
    while ((nread = fread(buffer, 1, sizeof(buffer), source)) != 0) {
      fwrite(buffer, 1, nread, target);
    }
    fclose(source);
  }
  fclose(target);
  return 0;
}
