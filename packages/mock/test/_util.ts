export function loop(func: () => void, loopCount = 100) {
  for (let i = 0; i < loopCount; i++) {
    func()
  }
}
