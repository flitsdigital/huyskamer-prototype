The signature De Huyskamer button — a red PT-Serif pill, plus an outline and a quiet ghost variant.

```jsx
<Button variant="primary">Reserveren</Button>
<Button variant="secondary" onDark>Bekijk de kaart</Button>
<Button variant="ghost" rightIcon={<Icon name="arrow-right" size={18} />}>Meer</Button>
<Button size="sm">Verstuur!</Button>
```

Variants: `primary` (red pill, default), `secondary` (pill outline, set `onDark` over dark surfaces), `ghost`. Sizes `sm` / `md`. Accepts `leftIcon` / `rightIcon`, `fullWidth`, `href` (renders an anchor).
